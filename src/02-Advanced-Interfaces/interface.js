// 使用接口约束对象
var userA = {
    id: 1,
    name: "张三",
    age: 25
};
// 使用示例
var product1 = {
    id: 1001,
    name: "TypeScript教程",
    price: 99
};
var product2 = {
    id: 1002,
    name: "JavaScript教程",
    price: 89,
    desc: "零基础入门",
    stock: 100
};
// 实现定义
var addFunc = function (x, y) { return x + y; };
console.log(addFunc(10, 20));
//实现定义
// 实现接口
var userService = {
    getUserById: function (id) { return ({ id: id, name: "默认用户", age: 18 }); },
    updateUserName: function (id, name) {
        console.log("\u66F4\u65B0\u7528\u6237".concat(id, "\u7684\u540D\u79F0\u4E3A\uFF1A").concat(name));
        return true;
    }
};
var dict = {
    name: "张三",
    city: "北京",
    // 可以动态添加任意字符串键
    gender: "男"
};
var arr = [1, 2, 3, 4];
console.log(arr[0]); // 输出：1
var mixed = {
    0: "第一个元素",
    1: "第二个元素",
    name: "混合字典",
    age: 25
};
// 使用示例
var student = {
    name: "李四",
    age: 20,
    studentId: 2024001,
    grade: "大一"
};
var workingStudent = {
    name: "王五",
    age: 22,
    company: "某科技公司",
    salary: 5000,
    major: "计算机科学"
};
// 合并后的接口包含：appName、version、port、env
var appConfig = {
    appName: "TS Demo",
    version: "1.0.0",
    port: 3000,
    env: "development"
};
// 实现合并后的函数接口
var calculate = function (a, b) {
    if (typeof a === "number" && typeof b === "number") {
        return a + b;
    }
    if (typeof a === "string" && typeof b === "string") {
        return a + b;
    }
    throw new Error("参数类型不匹配");
};
//test
console.log(calculate(10, 20)); // 输出：30
console.log(calculate("Hello", "TS")); // 输出：HelloTS
