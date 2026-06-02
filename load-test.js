/**
 * 简易并发压测脚本
 * 用法: node load-test.js [url] [并发数] [总请求数]
 *
 * 示例:
 *   node load-test.js http://localhost:3000/api/products 50 500
 */

const http = require('http');

const [,, baseUrl = 'http://localhost:3000/api/products', concurrency = '50', total = '500'] = process.argv;
const CONCURRENCY = parseInt(concurrency);
const TOTAL = parseInt(total);

function get(url) {
  return new Promise((resolve) => {
    const t0 = Date.now();
    http.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          time: Date.now() - t0,
          body,
        });
      });
    }).on('error', (err) => {
      resolve({ status: 0, time: Date.now() - t0, body: err.message });
    });
  });
}

function post(url, body) {
  return new Promise((resolve) => {
    const t0 = Date.now();
    const data = JSON.stringify(body);
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };
    const req = http.request(options, (res) => {
      let resBody = '';
      res.on('data', chunk => resBody += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          time: Date.now() - t0,
          body: resBody,
        });
      });
    });
    req.on('error', (err) => {
      resolve({ status: 0, time: Date.now() - t0, body: err.message });
    });
    req.write(data);
    req.end();
  });
}

function chunkedRequest(fn, ids) {
  const queue = [...ids];
  let completed = 0;
  let success = 0;
  let fail = 0;
  const times = [];

  return new Promise((resolve) => {
    function run() {
      while (queue.length > 0) {
        const id = queue.shift();
        fn(id).then((result) => {
          times.push(result.time);
          completed++;
          if (result.status >= 200 && result.status < 400) success++;
          else fail++;
          process.stdout.write(`\r[${completed}/${TOTAL}] 成功: ${success}  失败: ${fail}  延迟: ${result.time}ms  \r`);
          run();
        });
        if (queue.length > 0) run();
        if (queue.length >= CONCURRENCY) break;
      }
      if (completed >= TOTAL) {
        resolve({ success, fail, times });
      }
    }

    for (let i = 0; i < CONCURRENCY; i++) {
      if (queue.length === 0) break;
      fn(queue.shift()).then((result) => {
        times.push(result.time);
        completed++;
        if (result.status >= 200 && result.status < 400) success++;
        else fail++;
        process.stdout.write(`\r[${completed}/${TOTAL}] 成功: ${success}  失败: ${fail}  延迟: ${result.time}ms  \r`);
        run();
      });
    }
  });
}

async function main() {
  const urlObj = new URL(baseUrl);
  const isPost = process.argv.includes('--post');
  const isDelete = process.argv.includes('--delete');

  console.log(`\n========== Load Test ==========`);
  console.log(`目标:  ${baseUrl}`);
  console.log(`并发:  ${CONCURRENCY}`);
  console.log(`总数:  ${TOTAL}`);
  console.log(`类型:  ${isPost ? 'POST' : isDelete ? 'DELETE' : 'GET'}`);
  console.log(`================================\n`);

  const t0 = Date.now();

  if (isPost) {
    // POST 请求，模拟批量创建商品
    const results = await chunkedRequest(
      () => post(baseUrl, {
        name: `LoadTest-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        price: Math.round(Math.random() * 1000),
        stock: Math.floor(Math.random() * 100),
        description: '压测数据',
      }),
      Array.from({ length: TOTAL }, (_, i) => i)
    );
    finish(results, t0);
  } else if (isDelete) {
    // DELETE 请求，假设商品 id 为 1~TOTAL
    const results = await chunkedRequest(
      (id) => new Promise((resolve) => {
        const t0 = Date.now();
        const req = http.request(`${baseUrl}/${id}`, { method: 'DELETE' }, (res) => {
          let b = '';
          res.on('data', c => b += c);
          res.on('end', () => resolve({ status: res.statusCode, time: Date.now() - t0, body: b }));
        });
        req.on('error', e => resolve({ status: 0, time: Date.now() - t0, body: e.message }));
        req.end();
      }),
      Array.from({ length: TOTAL }, (_, i) => i + 1)
    );
    finish(results, t0);
  } else {
    // GET 请求
    const results = await chunkedRequest(
      (id) => get(`${baseUrl}${id ? '/' + id : ''}`),
      Array.from({ length: TOTAL }, (_, i) => i + 1)
    );
    finish(results, t0);
  }
}

function finish(results, t0) {
  const totalTime = Date.now() - t0;
  const times = results.times.sort((a, b) => a - b);
  const avg = (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1);
  const min = times[0];
  const p50 = times[Math.floor(times.length * 0.50)];
  const p95 = times[Math.floor(times.length * 0.95)];
  const p99 = times[Math.floor(times.length * 0.99)];
  const max = times[times.length - 1];
  const qps = ((results.success + results.fail) / (totalTime / 1000)).toFixed(1);

  console.log(`\n\n========== 压测结果 ==========`);
  console.log(`总耗时:   ${(totalTime / 1000).toFixed(2)}s`);
  console.log(`QPS:      ${qps} req/s`);
  console.log(`成功率:   ${results.success}/${results.success + results.fail}`);
  console.log(`--------------------------------`);
  console.log(`响应时间 (ms):`);
  console.log(`  平均:   ${avg}`);
  console.log(`  最小:   ${min}`);
  console.log(`  P50:    ${p50}`);
  console.log(`  P95:    ${p95}`);
  console.log(`  P99:    ${p99}`);
  console.log(`  最大:   ${max}`);
  console.log(`================================\n`);
}

main().catch(console.error);
