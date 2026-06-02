/**
 * Redis 缓存层 — 独立控制架构
 *
 * 两个独立开关：
 *   cacheEnabled  — 缓存总开关（开/关）
 *   cacheMode     — 缓存模式（normal / penetration / breakdown / avalanche）
 *
 * 组合实验矩阵：
 *   缓存开 + Normal    → 缓存正常工作，命中率高高
 *   缓存开 + 穿透      → 缓存开但被清空，所有请求穿透 DB
 *   缓存开 + 击穿      → 缓存开，但热点 key 被删，并发同时打 DB
 *   缓存开 + 雪崩      → 缓存开但模拟宕机，所有请求穿透 DB
 *   缓存关 + 任意模式   → 无缓存层，所有请求直击 DB
 */

import Redis from 'ioredis';

export type CacheMode = 'normal' | 'penetration' | 'breakdown' | 'avalanche';

// ---------- Redis Client ----------

export const redis = new Redis({
  host: 'localhost',
  port: 6379,
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  connectTimeout: 3000,
});

redis.on('error', (err) => {
  // 静默错误，不影响无 Redis 时的服务
});

// ---------- Global State ----------

let cacheEnabled = true;   // 缓存总开关
let cacheMode: CacheMode = 'normal';  // 缓存模式

// 统计
let totalRequests = 0;
let cacheHits = 0;
let cacheMisses = 0;
let dbHits = 0;

export function getCacheStats() {
  return { totalRequests, cacheHits, cacheMisses, dbHits };
}

export function resetCacheStats() {
  totalRequests = 0;
  cacheHits = 0;
  cacheMisses = 0;
  dbHits = 0;
}

// ---------- Cache Control API ----------

export function setCacheEnabled(enabled: boolean) {
  cacheEnabled = enabled;
  console.log(`[Cache] ${enabled ? '✅ 缓存已启用' : '🚫 缓存已禁用'}`);
}

export function isCacheEnabled() {
  return cacheEnabled;
}

export function setCacheMode(mode: CacheMode) {
  cacheMode = mode;
  console.log(`[Cache Mode] ${mode}`);
}

export function getCacheMode(): CacheMode {
  return cacheMode;
}

export function getCacheConfig() {
  return {
    enabled: cacheEnabled,
    mode: cacheMode,
    stats: getCacheStats(),
  };
}

// ---------- Scenario Activation ----------

export async function activateScenario(mode: CacheMode) {
  cacheMode = mode;
  switch (mode) {
    case 'penetration':
      await redis.flushdb();
      console.log('[Scenario] 穿透: 缓存已清空，请求将全部穿透到 DB');
      break;
    case 'breakdown': {
      const keys = await redis.keys('product:*');
      if (keys.length > 0) {
        await redis.del(...keys);
        console.log(`[Scenario] 击穿: 已删除 ${keys.length} 个热点 key，并发将同时击穿到 DB`);
      } else {
        console.log('[Scenario] 击穿: 无热点 key，请先预热缓存');
      }
      break;
    }
    case 'avalanche': {
      const keys = await redis.keys('*');
      const toExpire = keys.slice(0, Math.floor(keys.length * 0.8));
      if (toExpire.length > 0) await redis.del(...toExpire);
      console.log(`[Scenario] 雪崩: 缓存离线，${toExpire.length} 个 key 已失效`);
      break;
    }
    case 'normal':
    default:
      console.log('[Scenario] Normal: 缓存恢复正常');
      break;
  }
}

export async function resetScenario() {
  cacheMode = 'normal';
}

// ---------- Core Cache Operations ----------

export async function cacheGet(key: string): Promise<{ hit: boolean; value: string | null }> {
  totalRequests++;

  // 缓存关闭时，直接视为未命中
  if (!cacheEnabled) {
    cacheMisses++;
    return { hit: false, value: null };
  }

  // 雪崩: 模拟缓存离线
  if (cacheMode === 'avalanche') {
    cacheMisses++;
    return { hit: false, value: null };
  }

  try {
    const value = await redis.get(key);
    if (value !== null) {
      cacheHits++;
      return { hit: true, value };
    }
  } catch {
    // Redis 出错，降级到 DB
  }

  cacheMisses++;
  return { hit: false, value: null };
}

export async function cacheSet(key: string, value: string, ttlSeconds = 300): Promise<void> {
  if (!cacheEnabled) return;
  try {
    await redis.setex(key, ttlSeconds, value);
  } catch {
    // Redis 出错，静默忽略
  }
}

export async function cacheDel(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch {
    // 静默忽略
  }
}

export async function recordDbHit(): Promise<void> {
  dbHits++;
}

export async function cacheClear(): Promise<void> {
  try {
    await redis.flushdb();
  } catch {
    // 静默忽略
  }
}
