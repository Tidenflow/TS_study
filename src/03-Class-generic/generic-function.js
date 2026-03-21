/**
 * 1. 基础泛型函数：返回原值（identity 函数）
 * T：类型变量（可自定义命名，常用 T/S/K/V 等）
 * 作用：接收任意类型的参数，返回同类型的值
 */
function identity(value) {
    return value;
}
/**
 * 2. 带约束的泛型函数：获取对象指定键的值
 * T：表示任意对象类型
 * K extends keyof T：约束 K 必须是 T 的键名（keyof 取对象的键联合类型）
 * 返回值 T[K]：表示 T 中 K 键对应的值的类型
 */
function pickFirst(obj, key) {
    return obj[key];
} //===> 这个函数当然也是一个多泛型参数函数
/**
 * 3. 多泛型参数函数：创建键值对数组
 * S：第一个值的类型
 * T：第二个值的类型
 * 返回值 [S, T]：元组类型，严格匹配两个参数的类型
 */
function createPair(first, second) {
    return [first, second];
}
// ==================== 测试代码 ====================
function testGenericFunctions() {
    // 1. 测试 identity 函数
    console.log("=== 测试 identity 函数 ===");
    var str = identity("Hello TypeScript"); // 显式指定 T 为 string
    var num = identity(123); // 隐式推导 T 为 number
    var bool = identity(true); // 隐式推导 T 为 boolean
    console.log(str); // Hello TypeScript
    console.log(num); // 123
    console.log(bool); // true
    // 2. 测试 pickFirst 函数（带 extends 约束）
    console.log("\n=== 测试 pickFirst 函数 ===");
    var user = { name: "张三", age: 20, isStudent: true };
    // 合法："name" 是 user 的键
    var userName = pickFirst(user, "name");
    console.log(userName); // 张三
    // 合法："age" 是 user 的键
    var userAge = pickFirst(user, "age");
    console.log(userAge); // 20
    // 报错："gender" 不是 user 的键（约束生效）
    // const userGender = pickFirst(user, "gender"); 
    // 3. 测试 createPair 函数（多泛型参数）
    console.log("\n=== 测试 createPair 函数 ===");
    var pair1 = createPair("name", "李四"); // [string, string]
    var pair2 = createPair(1, "apple"); // [number, string]
    var pair3 = createPair(true, { id: 1 }); // [boolean, { id: number }]
    console.log(pair1); // ["name", "李四"]
    console.log(pair2); // [1, "apple"]
    console.log(pair3); // [true, { id: 1 }]
}
// 执行测试
testGenericFunctions();
//收获 ： 可复用性极高！！
