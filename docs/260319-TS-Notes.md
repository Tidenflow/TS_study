# TypeScript 函数与接口知识点总结

> 02-Advanced-Interfaces 文件夹代码总结

---

## 目录

1. [函数类型](#1-函数类型tsfunctionts)
2. [函数重载](#2-函数重载)
3. [this 类型](#3-this-类型)
4. [接口基础](#4-接口基础interfacets)
5. [可选属性与只读属性](#5-可选属性与只读属性)
6. [函数类型接口](#6-函数类型接口)
7. [索引签名](#7-索引签名)
8. [接口继承](#8-接口继承)
9. [接口合并](#9-接口合并)

---

## 1. 函数类型 (ts.function.ts)

### 1.1 函数表达式类型

**方式一：直接声明类型（推荐）**

```typescript
// 变量名: (参数类型) => 返回值类型 = 具体函数
const multiply: (x: number, y: number) => number = (x, y) => x * y;
const sayHello: () => string = () => "hello";
```

**方式二：使用类型别名**

```typescript
// 先定义函数类型别名，再复用（适合复杂函数类型）
type CalculateFunc = (a: number, b: number) => number;
const calFunc: CalculateFunc = (x, y) => {
    return x + y;
}
```

### 1.2 可选参数、默认参数、剩余参数

```typescript
function buildName(
    firstName: string,
    lastName?: string,      // 可选参数：参数名后加 ?，必须放在必选参数后面
    age: number = 18,      // 默认参数：直接给参数赋值，会自动推导类型
    ...hobbies: string[]    // 剩余参数：用 ... 接收多个参数，类型为数组
): string {
    let fullName = firstName;
    if (lastName) fullName += `${lastName}`;
    fullName += ` (年龄: ${age})`;
    if (hobbies.length > 0) fullName += ` (爱好: ${hobbies.join(", ")})`;
    return fullName;
}

// 调用示例
buildName("张三");                              // 张三 (年龄: 18)
buildName("李四", "小四");                       // 李四 小四 (年龄: 18)
buildName("王五", "小五", 20);                   // 王五 小五 (年龄: 20)
buildName("赵六", "小六", 22, "篮球", "编程");   // 赵六 小六 (年龄: 22)，爱好：篮球, 编程
```

---

## 2. 函数重载

### 2.1 基本概念

函数重载：定义多个函数签名（重载列表），实现一个具体函数。作用是让函数根据不同参数类型/个数，返回对应类型的结果，提升类型提示准确性。

```typescript
type hdData = string | number | boolean;

// 重载签名（必须写在实现签名之前）
function handleData(data: string): string;
function handleData(data: number): number[];
function handleData(data: boolean): boolean;

// 实现签名
function handleData(data: hdData): string | number[] | boolean {
    if (typeof data === "string") {
        return data.toUpperCase();
    } else if (typeof data === "number") {
        return [data, 2 * data, 3 * data];
    } else {
        return !data;
    }
}

// 调用示例（TS会根据入参类型自动推导返回值类型）
const strResult = handleData("hello");  // 类型提示：string → 结果：HELLO
const numResult = handleData(5);         // 类型提示：number[] → 结果：[5,10,15]
const boolResult = handleData(true);     // 类型提示：boolean → 结果：false
```

> **注意**：重载签名必须写在实现签名之前，中间不能插入其他代码。

---

## 3. this 类型

### 3.1 this 参数的作用

TypeScript 中通过指定 this 参数（第一个参数），约束函数内 this 的类型。**this 参数仅用于类型检查，编译后会被移除，不会实际传递**。

```typescript
interface User {
    name: string;
    age: number;
    sayHi: (this: User) => void;
    updateAge: (this: User, newAge: number) => void;
}

const user1: User = {
    name: "小明",
    age: 20,
    sayHi(this: User) {
        console.log(`你好，我是${this.name}，今年${this.age}岁`);
    },
    updateAge(this: User, newAge: number) {
        if (newAge < 0 || newAge > 120) throw new Error("年龄不合法");
        this.age = newAge;
    },
};

user1.sayHi();           // 输出：你好，我是小明，今年20岁
user1.updateAge(21);     // 输出：年龄已更新为：21
```

### 3.2 this 的绑定方式

this 不能直接传参，只能通过 `实例.方法()`、`bind`、`call`、`apply` 绑定：

```typescript
function printAge(this: { age: number }) {
    console.log(this.age);
}

// 方式1：挂载到对象上调用
const person = { age: 20, printAge };
person.printAge();

// 方式2：使用 call
printAge.call({ age: 25 });

// 带参数的方法 + call
function printInfo(this: { age: number }, hobby: string, city: string) {
    console.log(`年龄：${this.age}，爱好：${hobby}，城市：${city}`);
}
printInfo.call({ age: 25 }, "篮球", "北京");

// 方式3：使用 apply（参数以数组传递）
printInfo.apply({ age: 30 }, ["读书", "上海"]);

// 方式4：使用 bind（绑定 this 后返回新函数，可预设参数，不立即执行）
const boundPrintInfo = printInfo.bind({ age: 22 }, "游泳");
boundPrintInfo("广州"); // 输出：年龄：22，爱好：游泳，城市：广州
```

### 3.3 箭头函数的 this

箭头函数无自己的 this，继承外层作用域的 this，且**不能指定 this 参数**：

```typescript
const user6 = {
    name: "小红",
    age: 19,
    sayHi: () => {
        // 箭头函数不能有'this'参数，this指向外层作用域
    },
};
```

---

## 4. 接口基础 (interface.ts)

### 4.1 定义对象结构

```typescript
interface User {
    id: number;
    name: string;
    age: number;
}

const userA: User = {
    id: 1,
    name: "张三",
    age: 25
};
```

---

## 5. 可选属性与只读属性

```typescript
interface Product {
    readonly id: number;    // 只读属性：初始化后不能修改
    name: string;            // 必选属性
    price: number;           // 必选属性
    desc?: string;           // 可选属性：可以有也可以没有
    stock?: number;          // 可选属性
}

const product1: Product = {
    id: 1001,
    name: "TypeScript教程",
    price: 99
};

// product1.id = 1003; // ❌ 报错：Cannot assign to 'id' because it is a read-only property
```

---

## 6. 函数类型接口

### 6.1 直接定义函数类型

```typescript
interface AddFunc {
    (a: number, b: number): number;
}

const addFunc: AddFunc = (x, y) => x + y;
```

### 6.2 结合对象结构的函数接口

```typescript
interface UserService {
    getUserById: (id: number) => User;
    updateUserName: (id: number, name: string) => boolean;
}

const userService: UserService = {
    getUserById: (id) => ({ id, name: "默认用户", age: 18 }),
    updateUserName: (id, name) => {
        console.log(`更新用户${id}的名称为：${name}`);
        return true;
    }
};
```

---

## 7. 索引签名

### 7.1 字符串索引

对象的属性名不固定，但属性值类型固定：

```typescript
interface StringDictionary {
    [key: string]: string;
}

const dict: StringDictionary = {
    name: "张三",
    city: "北京",
    gender: "男"  // 可以动态添加任意字符串键
};
```

### 7.2 数字索引

```typescript
interface NumberArray {
    [index: number]: number;
}

const arr: NumberArray = [1, 2, 3, 4];
console.log(arr[0]); // 输出：1
```

### 7.3 混合索引

```typescript
interface MixedDictionary {
    [index: number]: string;           // 数字索引
    [key: string]: string | number;     // 字符串索引必须包含数字索引的类型
}

const mixed: MixedDictionary = {
    0: "第一个元素",
    1: "第二个元素",
    name: "混合字典",
    age: 25
};
```

> **注意**：字符串索引是数字索引的超集，混合使用时字符串索引的类型必须包含数字索引的类型。

---

## 8. 接口继承

### 8.1 单继承

```typescript
interface Person {
    name: string;
    age: number;
}

interface Student extends Person {
    studentId: number;
    grade: string;
}

const student: Student = {
    name: "李四",
    age: 20,
    studentId: 2024001,
    grade: "大一"
};
```

### 8.2 多继承

```typescript
interface Worker {
    company: string;
    salary: number;
}

interface WorkingStudent extends Person, Worker {
    major: string;
}

const workingStudent: WorkingStudent = {
    name: "王五",
    age: 22,
    company: "某科技公司",
    salary: 5000,
    major: "计算机科学"
};
```

---

## 9. 接口合并

### 9.1 同名接口自动合并

同名接口会自动合并（仅接口支持，type 不支持）：

```typescript
interface Config {
    appName: string;
    version: string;
}

interface Config {
    port: number;
    env?: string;
}

// 合并后的接口包含：appName、version、port、env
const appConfig: Config = {
    appName: "TS Demo",
    version: "1.0.0",
    port: 3000,
    env: "development"
};
```

### 9.2 函数接口的合并（函数重载）

```typescript
interface Calculate {
    (a: number, b: number): number;
}

interface Calculate {
    (a: string, b: string): string;
}

const calculate: Calculate = (a: any, b: any): any => {
    if (typeof a === "number" && typeof b === "number") {
        return a + b;
    }
    if (typeof a === "string" && typeof b === "string") {
        return a + b;
    }
    throw new Error("参数类型不匹配");
};

console.log(calculate(10, 20));        // 输出：30
console.log(calculate("Hello", "TS")); // 输出：HelloTS
```

---

## 总结

| 知识点 | 说明 |
|--------|------|
| 函数表达式类型 | 两种方式：直接声明类型 vs 类型别名 |
| 可选/默认/剩余参数 | `?` 可选、`=` 默认、`...` 剩余 |
| 函数重载 | 多个签名 + 一个实现，必须声明在前 |
| this 类型 | 通过 `call`/`apply`/`bind` 绑定，箭头函数继承外层 |
| 接口属性 | `readonly` 只读、`?` 可选 |
| 索引签名 | 字符串/数字索引，支持混合类型 |
| 接口继承 | 单继承 `extends A`，多继承 `extends A, B` |
| 接口合并 | 同名接口自动合并（type 不支持） |

---

