"use strict";
// primitive.ts (原始类型与严格检查)
// 这个文件主要解决“数据的基础形态”以及“严谨性”问题。
// ===存放内容：===
// (1)基础声明： 定义 string, number, boolean, symbol 变量。
// (2)Strict Null Check 实验： 声明一个 number 变量，尝试赋值 null 或 undefined。观察在 tsconfig.json 中开启/关闭 strictNullChecks 时编译器的不同反应。
// (3)模板字符串测试： 尝试用 string 类型接收一个复杂的模板字符串，感受类型推导。
// 隐式类型
let username = "Tom";
console.log(username);
// 显式类型
let teamname = "Barsa";
console.log(teamname);
//有几个需要注意
//(1)let/const 是块级作用域的声明方式，JS/TS 规定：同一个作用域内，不能用 let/const 重复声明同一个变量名；
//          let team name : string = "Real"  上面已经使用let声明过了
//(2)    : string   这种类型标注，是声明变量时的语法（配合 let/const/var 使用）
// hisname : string = "Tom";    ->  这是一个赋值语句 不能使用   : string
console.log("===1.什么时候必须显式写类型？===");
//  变量声明时没有初始值
let hisName;
hisName = "hisName";
// 需要限制类型范围（比如联合类型）
let id = 123;
console.log(id);
console.log(typeof (id));
id = "12345;";
console.log(id);
console.log(typeof (id));
// 下面这个就不对
// id = true;     不能将类型“boolean”分配给类型“string | number”。
// 类型推断不符合预期时
// 什么是字面量类型？？？？   --->  字面量类型（Literal Type）是 TypeScript 特有的类型，
// 核心是把「具体的单个值」作为一种类型—— 它不是宽泛的 string/number，而是这个值本身，是通用类型的「最小子集」。
// 案例1：无显式标注，TS 推断为「字面量类型 "Tom"」
let username1 = "Tom";
// username1 = "Jerry"; // ❌ TS 报错：不能将类型 "Jerry" 分配给类型 "Tom"
// 案例2：显式标注 string，强制为「通用 string 类型」
let username2 = "Tom";
username2 = "Jerry"; // ✅ 合法：通用 string 可以赋值任意字符串
// ==！！注意！！==  上面用的还是let 只要避免类型推断错误，避免字面量就可以
// 但是  const  不行
const username3 = "Mike";
// username3 = "Fancy"; // 无法分配到 "username3" ，因为它是常数。
const username4 = "Mike";
// username4 = "Jerry"; //无法分配到 "username4" ，因为它是常数。
let is_true = true;
console.log(typeof (is_true));
let isTrue = false;
console.log(typeof (isTrue));
// 尝试关闭  "strict": true
console.log("===关闭\"strict\": true===");
let username5 = "Mike";
console.log(typeof (username5));
// 下面这几句必须在  "strict": false下执行才能触发
//  因为 null / undefined 都是没有方法的   所以不能调用
//  username5 = null;  //不能将类型“null”分配给类型“string”。
//  console.log(typeof(username5));
//  console.log(username5.toString());   //Cannot read properties of null (reading 'toString')
//number
let age = 25;
console.log(age);
let price = 19.99;
console.log(price);
// 下面这个报错  ： 目标低于 ES2020 时，BigInt 字面量不可用。
let d = 9007199254740991n; // 大整数，需要用 bigint 类型
console.log(d);
// 是因为tsconfig.json 里 target 是 "es2015"，低于 ES2020，所以 不能使用 BigInt。
// 这意味着在这个项目中，number 就是全部了，不用加 bigint。
// 如果未来把 target 升到 ES2020+，就可以这样用：
