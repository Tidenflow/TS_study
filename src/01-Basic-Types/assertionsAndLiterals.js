"use strict";
// 断言
console.log("===1.断言===");
let value5 = "Tom";
let strLength = value5.length;
console.log(strLength);
//尝试欺骗
let value6 = 123;
console.log(value6.length);
// 字面量类型（Literal Types）   本节核心
let role = "admin";
console.log(typeof role); //输出string
let role1 = "TM";
console.log(typeof role1); //输出string
let role2 = "admin";
console.log(typeof role2); //输出string
//为什么要有类型别名呢？？
//======场景 1：多次使用这个类型（复用性）
//如果你的代码里有 10 个变量 / 函数需要约束为「admin/user」：
let user_1;
let user_2;
let user_3;
// ... 还要写7次，代码冗余且容易写错
//  写法2：类型别名 → 只定义1次，到处复用
// type Role = "admin" | "user";
// let user1: Role;
// let user2: Role;
// let user3: Role;
//  ... 直接用 Role 即可，简洁且统一
// ======场景 2：修改类型（可维护性）
// 如果后续需要给这个类型加一个值（比如新增 "guest"）：
// 写法1：直接用联合类型 → 要找到所有写 "admin" | "user" 的地方，逐个改成 "admin" | "user" | "guest"
// 漏改一个就会出问题，维护成本极高
// 写法2：类型别名 → 只改1处即可，所有复用的地方自动生效
// type Role = "admin" | "user" | "guest"; // 仅修改这里
// let user1: Role; // 自动支持 "guest"
// let user2: Role; // 自动支持 "guest"
// ======场景 3：函数 / 接口中使用（可读性）
// 类型别名能让代码语义更清晰，别人一看就知道「Role 代表用户角色」：
// 写法1：直接用联合类型 → 函数参数类型冗长，语义不清晰
// function setUserType(type: "admin" | "user") {
//   // ...
// }
// // 写法2：类型别名 → 语义清晰，代码更易读
// type Role = "admin" | "user";
// function setUserType(type: Role) {
//   // ...
// }
// ====== as const  ======
console.log("===实验一===");
const user7 = {
    role: "admin"
};
//尝试悬停在user7上面  显示role是string
const user8 = {
    role: "admin"
};
////尝试悬停在user8上面  显示role是"admin"
console.log("===实验二===");
user7.role = "user";
console.log(user7.role);
// user8.role = "user" // 编辑时报错 ： 无法为“role”赋值，因为它是只读属性。
const roles1 = ["admin", "user"]; //悬停显示是 roles1 : string[]
const roles2 = ["admin", "user"]; //悬停显示是roles2 : ["admin", "user"]
//常见高级写法
console.log("===高级写法===");
const roles = ["admin", "user"];
let role_exam;
role_exam = "admin";
console.log(typeof roles);
console.log(typeof role_exam);
