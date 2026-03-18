//数组类型
console.log("===1.数组类型===");
console.log("===(1)普通数组===");
var numbers = [1, 2, 3];
console.log(numbers);
console.log("===(2)等价写法===");
var numbers2 = [1, 2, 3];
console.log(numbers2);
// 数组特点：
// (1)元素类型相同
// (2)长度不固定
// numbers.push("hello");   //报错 ： 类型“string”的参数不能赋给类型“number”的参数。
numbers.push(99);
console.log(numbers);
numbers2.pop();
console.log(numbers2);
numbers.reverse();
console.log(numbers);
//元组类型
// ✅ 固定长度
// ✅ 固定每个位置的类型
console.log("\n \n");
console.log("===2.元组类型===");
console.log("===(1)元组定义===");
var user = [1, "Tom"];
console.log(user);
user = [2, "Jason"];
console.log(user);
user.push(30);
console.log(user); //确实可以加进去并输出 原因如下 ：
// 在 TypeScript 中，元组的 “固定长度” 是编译时的类型约束（初始化 / 直接赋值必须符合长度），
// 但运行时（编译成 JS 后）可通过数组方法（如 push）改变长度，
// 因此从实际执行层面看，元组并非绝对定长；若想强制定长，需用 readonly 修饰元组。
console.log("===(2)只读元组===");
var user2 = [3, "Mike"];
console.log(user2);
// user2[1] = "Jason";   //编辑器报错 ：无法为“1”赋值，因为它是只读属性。
// user2.push(30)  //编辑时报错 ： 类型“readonly [number, string]”上不存在属性“push”。
