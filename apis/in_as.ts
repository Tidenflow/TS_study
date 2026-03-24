// 1.in
const unlockedNodes = { node1: true, node2: false };

const nodeId = "node1";
const boolean1 : boolean = nodeId in unlockedNodes;    // key in 对象
console.log(boolean1); // 输出true
//它只检查 key，不检查值。  值是 undefined / null / false 都会返回 true。

// in 是可以遍历使用的
type NodeIds = "node1" | "node2" | "node3";
type UnLockedNodes = {
    [key in NodeIds] : string | boolean;   //  下面这个错 可以改为联合
    // [key in NodeIds] : boolean;     //  同一个对象类型里，不能写两个一模一样的遍历语法！ 
}


// 2.as  
// 其实就是断言
// const elem = document.getElementById("myDiv") as HTMLDivElement;
// TS 默认只知道是 HTMLElement | null     你用 as 明确它是 div。

//  也可以  <类型>value
const str1 : "TOM" = "TOM";
console.log(typeof <string>str1);  //输出string  可以转化为string unknown any  其他的string[]  undefined什么的都不对

// 3.keyof
type Obj = {a : number; b : string};
type Keys = keyof Obj;   // "a" | "b"

type Value = Obj["a"]; // number

const node = { id: 1, name: "hello"};
type NodeType = typeof node;
// { id: number; name: string }
// 但是
const node1 = { id: 1, name: "hello" as "hello"};
type NodeType1 = typeof node1;
// { id: number; name: "hello" }  


// 4.is类型守卫
function isNode(node: any): node is Node {
  return node && node.id !== undefined;
}