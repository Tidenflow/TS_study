// Array.isArray()用来判断一个值 是不是 数组，返回 true / false
const a = [1, 2, 3];
const b = { name: "abc" };
const c = null;
const d = "hello";

console.log(Array.isArray(a)); // true  ✅ 是数组
console.log(Array.isArray(b)); // false ❌ 是对象
console.log(Array.isArray(c)); // false ❌ 是 null
console.log(Array.isArray(d)); // false ❌ 是字符串