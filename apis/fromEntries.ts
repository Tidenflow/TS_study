// Object.fromEntries


// return Object.fromEntries(
//   map.nodes.map(node => [node.id, getNodeStatus(node, progress)])
// );
//将节点数组变为一个节点状态对象
// [ {id:1}, {id:2}, {id:3} ]
// 变为
// {
//   1: "Unlocked",
//   2: "Locked",
//   3: "Progress"
// }

//  Object.fromEntries() —— 超级重要  ===>>  把「二维键值对数组」直接变成「对象」
const arr = [
  ["name", "Tom"],
  ["age", 18]
];

const obj = Object.fromEntries(arr);
console.log(obj);  //输出 { name: 'Tom', age: 18 }