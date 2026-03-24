# TypeScript API 常用方法学习笔记

> 2026-03-24 学习内容总结（基于 `apis/` 目录下的 Demo 代码）

---

## 目录

1. [Object.fromEntries：将键值对数组转为对象](#1-objectuentries将键值对数组转为对象fromentriests)
2. [Array.map：数组映射](#2-arraymap数组映射arraymapts)
3. [Array.every：数组全量判断与 in/includes 区别](#3-arrayevery数组全量判断与-inincludes-区别everyts)
4. [Object 静态方法汇总](#4-object-静态方法汇总object_apits)
5. [类型操作符：in、as、keyof、typeof、类型守卫](#5-类型操作符inaskeyoftypeof类型守卫in_asts)
6. [今日总结与易错点](#6-今日总结与易错点)

---

## 1. Object.fromEntries：将键值对数组转为对象（fromEntries.ts）

### 1.1 基本用法

`Object.fromEntries()` 是 ES10 引入的方法，能够将「二维键值对数组」直接转换为「对象」。

```ts
const arr = [
  ["name", "Tom"],
  ["age", 18]
];

const obj = Object.fromEntries(arr);
console.log(obj);  // 输出 { name: 'Tom', age: 18 }
```

### 1.2 典型应用场景

将节点数组转换为状态对象：

```ts
// 输入：节点数组
const nodes = [{id: 1}, {id: 2}, {id: 3}];

// 输出：节点状态对象
// {
//   1: "Unlocked",
//   2: "Locked",
//   3: "Progress"
// }

// 实际使用示例
const nodeStatus = Object.fromEntries(
  nodes.map(node => [node.id, getNodeStatus(node, progress)])
);
```

### 1.3 关键理解

- 输入必须是 `[[key, value], [key, value], ...]` 格式的二维数组
- 常用于数据转换、API 响应处理、Map 与 Object 互转等场景

---

## 2. Array.map：数组映射（array.map.ts）

### 2.1 基本用法

`map()` 创建一个新数组，其结果是该数组中的每个元素调用一个提供的函数。

```ts
const arr = [1, 2, 3];
const newArr = arr.map(num => num * 2);
// newArr = [2, 4, 6]
```

### 2.2 关键特性

- 不改变原数组
- 返回新数组
- 常与 `Object.fromEntries` 配合使用

---

## 3. Array.every：数组全量判断与 in/includes 区别（every.ts）

### 3.1 every 方法基础

`every()` 测试数组中所有元素是否都满足指定条件，全部满足返回 `true`，否则返回 `false`。

```ts
const arr = [1, 2, 3];
const result = arr.every(num => num > 0);
console.log(result); // true
```

### 3.2 重点：in 和 includes 的区别

**`in` 操作符不能用于检查数组元素是否存在！**

```ts
// ❌ 错误用法：in 只能检查对象有没有这个 key
const deps = ["str", "ausihf", "easjf"];
const isTrue = deps.every(depId => depId in ["str", "iefh"]);
// 永远返回 false！因为 "str" 不可能成为数组的下标
```

**正确用法：使用 `includes()`**

```ts
// ✅ 正确用法
const deps = ["str", "ausihf", "easjf"];
const isTrue1 = deps.every(depId => ["str", "iefh"].includes(depId));
// false

const isTrue2 = deps.every(depId => ["str", "ausihf", "easjf"].includes(depId));
// true：所有元素都在目标数组中
```

### 3.3 in 操作符的正确用法

`in` 只能用于检查对象的键（key）是否存在：

```ts
const obj = { node1: true, node2: false };
const hasNode1 = "node1" in obj;  // true
const hasNode3 = "node3" in obj;  // false
```

即使值为 `undefined`、`null` 或 `false`，`in` 仍会返回 `true`（因为只检查 key）。

---

## 4. Object 静态方法汇总（Object_api.ts）

### 4.1 Object.keys()

返回对象所有 key 组成的数组。

```ts
const obj = { node1: true, node2: false };
console.log(Object.keys(obj));
// 输出 [ 'node1', 'node2' ]
```

### 4.2 Object.values()

返回对象所有 value 组成的数组。

```ts
const obj = { node1: true, node2: false };
console.log(Object.values(obj));
// 输出 [ true, false ]
```

### 4.3 Object.assign()

合并对象，返回新对象。

```ts
const target = { a: 1 };
const source = { b: 2 };
const result = Object.assign({}, target, source, { c: 3 });
// 输出 { a: 1, b: 2, c: 3 }
```

### 4.4 Object.hasOwn()

判断对象自身是否具有指定属性（不包括继承的属性）。

```ts
const obj = { node1: true, node2: false };
console.log(Object.hasOwn(obj, "node1"));  // true
console.log(Object.hasOwn(obj, "node3"));  // false
```

### 4.5 Object.entries()

返回对象所有 `[key, value]` 对组成的二维数组。

```ts
const obj = { node1: true, node2: false };
console.log(Object.entries(obj));
// 输出 [ [ 'node1', true ], [ 'node2', false ] ]
```

### 4.6 Record 类型

`Record<K, T>` 创建一个对象类型，键为 K，值为 T。

```ts
// 正确用法
const Nodes: Record<number, { unlockedAt: number }> = {
  1: { unlockedAt: 123 },
  2: { unlockedAt: 321 }
};
```

注意：`Record` 的第二个参数必须是完整的类型（如 `{ unlockedAt: number }`），而不是属性定义（如 `unlockedAt: number`）。

---

## 5. 类型操作符：in、as、keyof、typeof、类型守卫（in_as.ts）

### 5.1 in 操作符

用于检查对象是否包含指定键。

```ts
const obj = { node1: true, node2: false };
const hasNode1 = "node1" in obj;  // true
```

也可以用于映射类型（Mapped Types）：

```ts
type NodeIds = "node1" | "node2" | "node3";
type UnLockedNodes = {
  [key in NodeIds]: string | boolean;
}
```

### 5.2 as 断言

类型断言明确告诉 TypeScript 变量的具体类型。

```ts
// 方式一：as 语法
const elem = document.getElementById("myDiv") as HTMLDivElement;

// 方式二：尖括号语法（注意：不能用于 .tsx 文件）
const str = "TOM" as string;
```

### 5.3 keyof 操作符

获取对象类型的所有键组成的联合类型。

```ts
type Obj = { a: number; b: string };
type Keys = keyof Obj;  // "a" | "b"
```

### 5.4 typeof 操作符

获取变量的类型。

```ts
const node = { id: 1, name: "hello" };
type NodeType = typeof node;
// NodeType = { id: number; name: string }

// 如果使用字面量类型
const node1 = { id: 1, name: "hello" as "hello" };
type NodeType1 = typeof node1;
// NodeType1 = { id: number; name: "hello" }
```

### 5.5 类型守卫（Type Guard）

使用 `is` 关键字自定义类型谓词，在条件分支中缩小类型范围。

```ts
interface Node {
  id: number;
  name: string;
}

function isNode(node: any): node is Node {
  return node && node.id !== undefined;
}

// 使用
function process(data: any) {
  if (isNode(data)) {
    // 这里 TypeScript 知道 data 是 Node 类型
    console.log(data.id, data.name);
  }
}
```

---

## 6. 今日总结与易错点

### 6.1 今日核心收获

| 知识点 | 关键结论 |
|-------|---------|
| Object.fromEntries | 将二维键值对数组转为对象，常用于数据转换 |
| Array.map | 创建新数组，不改变原数组 |
| Array.every | 全部满足条件才返回 true |
| in vs includes | `in` 检查对象键，`includes` 检查数组元素 |
| Object.keys/values/entries | 获取对象的键/值/键值对数组 |
| Object.assign | 合并对象，返回新对象 |
| Object.hasOwn | 判断自身属性（不含继承） |
| Record | 创建键值类型映射的对象类型 |
| as 断言 | 明确告诉 TS 具体类型 |
| keyof | 获取对象类型的键联合类型 |
| typeof | 获取变量的类型 |
| 类型守卫 | 用 `is` 关键字自定义类型谓词 |

### 6.2 易错点清单

1. `in` 不能用于检查数组元素是否存在，必须用 `includes()`
2. `in` 检查对象时，即使值为 `undefined/null/false` 也会返回 `true`（只检查 key）
3. `Record<K, T>` 的第二个参数必须是完整类型，不能是属性定义
4. 类型断言 `as` 不能将不兼容的类型强制转换（如 `string` 转 `number[]`）
5. `Object.hasOwn()` 只检查自身属性，不包括继承的属性

### 6.3 一句话总结

本次学习覆盖了 JavaScript/TypeScript 中常用的 API 方法和类型操作符，重点区分了 `in` 与 `includes` 的使用场景，并掌握了对象与数组之间相互转换的技巧。

---
