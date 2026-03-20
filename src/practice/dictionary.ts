// practice/dictionary.ts

/**
 * 定义混合索引接口：
 * - 数字索引（数组式访问）：返回 string 类型
 * - 字符串索引（对象式访问）：返回 string | number 类型
 * 【TS 规则】数字索引的返回类型必须是字符串索引返回类型的子集（string 是 string | number 的子集，符合规则）
 */
interface MixedIndexDict {
  // 数字索引：通过数字访问时（如 dict[0]），值必须是 string 类型
  [index: number]: string;
  // 字符串索引：通过字符串访问时（如 dict["name"]），值可以是 string 或 number 类型
  [key: string]: string | number;
}

/**
 * 提取对象中所有字符串值，返回 string[]
 * @param obj 符合 MixedIndexDict 接口的对象
 * @returns 仅包含字符串值的数组
 */
function pickStringValues(obj: MixedIndexDict): string[] {
  // 存储提取出的字符串值
  const stringValues: string[] = [];

  // 遍历对象的所有字符串键（包含数字键的字符串形式，如 0 → "0"）
  for (const key in obj) {
    // 跳过原型链上的属性（仅处理自身属性）
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      // 过滤出字符串类型的值
      if (typeof value === "string") {
        stringValues.push(value);
      }
    }
  }

  return stringValues;
}

// ==================== 测试用例 ====================
// 测试 1：基础混合索引对象
const testDict1: MixedIndexDict = {
  0: "hello", // 数字索引 → string（符合约束）
  1: "world", // 数字索引 → string（符合约束）
  name: "张三", // 字符串索引 → string（符合约束）
  age: 18, // 字符串索引 → number（符合约束）
  hobby: "coding" // 字符串索引 → string（符合约束）
};

// 提取字符串值
const result1 = pickStringValues(testDict1);
console.log("测试 1 结果：", result1); 
// 输出：["hello", "world", "张三", "coding"]

// 测试 2：仅数字索引的对象
const testDict2: MixedIndexDict = {
  0: "TS",
  1: "JS",
  version: 5.4 // 字符串索引 → number
};
const result2 = pickStringValues(testDict2);
console.log("测试 2 结果：", result2); 
// 输出：["TS", "JS"]

// 测试 3：类型校验（不符合接口的赋值会报错）
// ❌ TS 报错：数字索引的值必须是 string 类型（123 是 number）
// const testDict3: MixedIndexDict = {
//   0: 123, 
//   name: "李四"
// };