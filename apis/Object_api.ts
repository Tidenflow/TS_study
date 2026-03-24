 // Object 就是 JS/TS 里所有「对象」的老祖宗
 //{}、[]、function(){}、new Date() 底层全部都是Object生出来的

 //Object.xxx() 就是给所有对象通用的工具方法

 const unlockedNodes = { node1: true, node2: false };

// 1.Object.keys (对象) → 拿所有 key
 console.log(Object.keys(unlockedNodes)); //输出[ 'node1', 'node2' ]
//  Object.keys(对象)：返回对象所有 key 组成的数组

// 2.Object.values (对象) → 拿所有 value
console.log(Object.values(unlockedNodes)); //输出[ true, false ]
//  Object.keys(对象)：返回对象所有 value 组成的数组

// 3.Object.assign (目标，源) → 合并对象
const newObj = Object.assign({}, unlockedNodes, { c:3 });
console.log(newObj);  //输出{ node1: true, node2: false, c: 3 }

// 4.Object.hasOwn (对象，key) → 判断 key 是否存在
const is_true : boolean = Object.hasOwn(unlockedNodes,"node1");
const is_false : boolean = Object.hasOwn(unlockedNodes,"node3");
console.log(typeof is_true);
if(is_true) console.log("TRUE");
console.log(typeof is_false);
if(is_false) console.log("FALSE");

// 5.Object.entries (对象) → 拿 [key, value] 对
console.log(Object.entries(unlockedNodes));
// 输出 [ [ 'node1', true ], [ 'node2', false ] ]




// Record<>是什么？？
// 是一个可扩展的对象的清晰的写法
// const Nodes : Record<number,  unlockedAt : number > = {
//     1 : 123;
// }
//  注意 ： Record<number,  unlockedAt : number >  是不对的  因为第二个参数位置  不是完整的类型
// 完整的类型 ： 
// 对象类型（完整） { unlockedAt: number }          联合类型（完整）string | number       单类型（完整）string   number
// 但是unlockedAt : number是属性不是类型
const Nodes : Record<number, { unlockedAt: number }> = {
    1 : {unlockedAt : 123},
    2 : {unlockedAt : 321}
}