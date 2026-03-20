# TypeScript 练习总结

> 2026-03-20 练习代码总结

---

## 目录

1. [接口与函数类型实战](#1-接口与函数类型实战basicts)
2. [混合索引签名](#2-混合索引签名dictionaryts)
3. [函数重载与默认参数](#3-函数重载与默认参数functionts)
4. [this 绑定与 call/apply/bind](#4-this-绑定与-callapplybindthis-and-interfacets)
5. [新收获汇总](#5-新收获汇总)

---

## 1. 接口与函数类型实战 (basic.ts)

### 1.1 接口中声明函数

接口只能声明结构，不能写实现（编译后消失，运行时不存在）：

```typescript
interface pc1_User {
    id: number;
    role: UserRole;
    status: ApiStatus;
    email?: string;

    // 接口中只能声明，不能实现
    formatUser: (this: pc1_User, role: UserRole, status: ApiStatus) => string;
    printInfo: (this: pc1_User) => void;
}
```

### 1.2 在对象中实现接口声明的方法

```typescript
const pc1_user1: pc1_User = {
    id: 1,
    role: "admin",
    status: "SUCESS",
    email: "@123",

    formatUser(role, status) {
        if (status === "SUCESS") {
            return `User${this.id} is ${this.role}`;
        }
        return "Error, status wrong";
    },

    printInfo() {
        let model = `id: ${this.id}\nrole: ${this.role}\n`;
        if (this.email) model += `email: ${this.email}`;
        console.log(model);
    }
};
```

### 1.3 as const 深度解析

**基础用法**：将变量类型收窄为字面量类型

```typescript
let role = "admin";           // 类型为 string
let role2 = "admin" as const; // 类型为 "admin"
```

**对象中使用**：所有属性变为只读

```typescript
const user = {
    role: "admin"
} as const;
// 类型：{ readonly role: "admin" }
```

**数组中使用**：变为只读元组

```typescript
const roles = ["admin", "user"];
// 类型：string[]

const roles2 = ["admin", "user"] as const;
// 类型：readonly ["admin", "user"]
```

**超级常见用法：自动生成联合类型**

```typescript
const roles = ["admin", "user"] as const;
type UserRole_ = typeof roles[number];
// type UserRole_ = "admin" | "user"
```

---

## 2. 混合索引签名 (dictionary.ts)

### 2.1 接口定义

```typescript
interface MixedIndexDict {
    // 数字索引：通过数字访问（如 dict[0]），值必须是 string 类型
    [index: number]: string;
    // 字符串索引：通过字符串访问（如 dict["name"]），值可以是 string 或 number
    [key: string]: string | number;
}
```

> **TS 规则**：数字索引的返回类型必须是字符串索引返回类型的子集（string 是 string | number 的子集）

### 2.2 使用示例

```typescript
const testDict: MixedIndexDict = {
    0: "hello",      // 数字索引 → string
    1: "world",      // 数字索引 → string
    name: "张三",     // 字符串索引 → string
    age: 18,         // 字符串索引 → number
    hobby: "coding"  // 字符串索引 → string
};
```

### 2.3 提取字符串值函数

```typescript
function pickStringValues(obj: MixedIndexDict): string[] {
    const stringValues: string[] = [];

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (typeof value === "string") {
                stringValues.push(value);
            }
        }
    }

    return stringValues;
}
```

---

## 3. 函数重载与默认参数 (function.ts)

### 3.1 函数重载

```typescript
type getData = string | number | boolean;
type judge = "YES" | "NO";

// 重载签名（必须写在实现之前）
function parseInput(data: string): string[];
function parseInput(data: number): number;
function parseInput(data: boolean): judge;

// 实现签名
function parseInput(data: getData): string[] | number | judge {
    if (typeof data === "string") {
        return data.split(", ");
    } else if (typeof data === "number") {
        return data * data;
    } else {
        return data ? "YES" : "NO";
    }
}

// 使用
parseInput("a, b, c"); // string[]
parseInput(5);         // number
parseInput(true);       // judge
```

### 3.2 默认参数

```typescript
function testFunc(
    name: string,
    id: number = 18  // 默认参数
): boolean {
    console.log(id);
    return true;
}

testFunc("asdfd", 20); // 输出 20（使用传入值）
testFunc("asdfd");     // 输出 18（使用默认值）
```

---

## 4. this 绑定与 call/apply/bind (this-and-interface.ts)

### 4.1 接口定义

```typescript
interface pc1_Student {
    readonly id: number;
    hobby: string[];
    age: number;

    updateAge(this: pc1_Student, age: number): void;
}
```

### 4.2 this 的四种绑定方式

```typescript
const student1: pc1_Student = {
    id: 1,
    hobby: ["唱歌", "跳", "Rap"],
    age: 18,
    updateAge(age) {
        console.log("id:", this.id);
        this.age = age;
    }
};

const student2: pc1_Student = {
    id: 2,
    hobby: ["篮球", "游戏"],
    age: 20,
    updateAge: student1.updateAge
};
```

**方式 1：对象直接调用**

```typescript
student1.updateAge(20); // this 指向 student1
```

**方式 2：call 调用**

```typescript
student1.updateAge.call(student2, 22);
// 语法：函数.call(thisArg, arg1, arg2, ...)
// 参数逐个传递
```

**方式 3：apply 调用**

```typescript
student1.updateAge.apply(student2, [25]);
// 语法：函数.apply(thisArg, [arg1, arg2, ...])
// 参数以数组传递
```

**方式 4：bind 绑定**

```typescript
// 绑定 this + 预设参数
const bindUpdateAge = student1.updateAge.bind(student1, 30);
bindUpdateAge(); // 立即执行，this 固定为 student1

// 只绑定 this，不预设参数
const bindStudent2 = student1.updateAge.bind(student2);
bindStudent2(28); // 调用时传参
```

---

## 5. 新收获汇总

| 知识点 | 说明 | 示例 |
|--------|------|------|
| 接口中不能写实现 | 编译后消失，运行时不存在 | 只能在对象中实现声明的方法 |
| as const | 深度收窄为字面量类型 | `["admin"] as const` → `readonly ["admin"]` |
| `typeof arr[number]` | 从数组提取联合类型 | `type R = typeof roles[number]` |
| 混合索引签名 | 数字索引必须是字符串索引的子集 | `[n: number]: string` ⊂ `[k: string]: string \| number` |
| call/apply/bind | 手动绑定 this | call 逐个传参，apply 数组传参，bind 返回新函数 |
| 默认参数 | 直接赋值，会自动推导类型 | `id: number = 18` |

### Interface vs C++ 基类

| 特性 | C++ 基类 | TS interface |
|------|----------|---------------|
| 存在于运行时 | ✅ | ❌ |
| 有内存布局 | ✅ | ❌ |
| 有方法实现 | ✅ | ❌ |
| 允许虚函数 | ✅ | ❌ |
| 只是约束结构 | ❌ | ✅ |

### 避免重复实现函数的方法

1. **使用 class**（面向对象）
2. **公共函数**：在外部实现，接口中只声明类型
3. **工厂函数**：用函数"生产"对象

```typescript
function createUser(id: number, role: UserRole, status: ApiStatus) {
    return {
        id, role, status,
        formatUser(newRole: UserRole) {
            this.role = newRole;
            return this;
        }
    };
}
```

---

## 总结

本次练习重点巩固了：

- 接口的约束能力与局限性
- `as const` 的深度用法（生成联合类型）
- 混合索引签名的类型规则
- `this` 的四种绑定方式
- 函数重载与默认参数

这些都是前两天学习的实战应用，通过具体场景加深了对 TypeScript 类型系统的理解。

---
