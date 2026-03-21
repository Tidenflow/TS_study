# TypeScript 类与泛型学习笔记

> 2026-03-21 学习内容总结（基于 `src/03-Class-generic`）

---

## 目录

1. [类的基础：属性修饰符、构造函数与实例方法](#1-类的基础属性修饰符构造函数与实例方法classts)
2. [类继承：extends、super 与方法重写](#2-类继承extendssuper-与方法重写class-inheritancets)
3. [抽象类：抽象属性、抽象方法与多态](#3-抽象类抽象属性抽象方法与多态abstract-classts)
4. [泛型函数：类型参数、约束与多泛型参数](#4-泛型函数类型参数约束与多泛型参数generic-functionts)
5. [泛型接口：接口泛型化与两种实现方式](#5-泛型接口接口泛型化与两种实现方式generic-interfacets)
6. [今日总结与易错点](#6-今日总结与易错点)

---

## 1. 类的基础：属性修饰符、构造函数与实例方法（class.ts）

### 1.1 类的成员修饰符
在 `PersonClass` 中，演示了 4 类常见成员：

```ts
class PersonClass {
  public name: string;
  readonly age: number;
  private id: number;
  private static nextId: number = 1;
}
```

- `public`：默认可见性，类内外都可访问
- `readonly`：只能在声明时或构造函数内赋值，之后不可改
- `private`：只能在类内部访问，外部不可直接访问
- `static`：属于类本身，不属于实例（通过 `类名.属性` 访问）

### 1.2 constructor 的作用

```ts
constructor(name: string, age: number) {
  this.name = name;
  this.age = age;
  this.id = PersonClass.nextId++;
}
```

- 构造函数在 `new` 时执行，用于初始化实例
- 通过静态属性 `nextId`，实现每个实例的唯一编号

### 1.3 方法中的 this 类型标注

```ts
introduce(this: PersonClass): string {
  return `大家好，我叫${this.name}，今年${this.age}岁，内部编号是${this.id}`;
}
```

- `this: PersonClass` 用于约束调用上下文类型
- 只参与类型检查，不会成为运行时参数

### 1.4 访问 private 成员的正确方式

```ts
getPersonId(): number {
  return this.id;
}
```

- 外部不能直接读 `id`
- 通过公开方法间接获取，是常见封装手段

---

## 2. 类继承：extends、super 与方法重写（class-inheritance.ts）

### 2.1 基础继承结构

```ts
class Animal {
  constructor(public name: string) {}
  speak(): string {
    return `${this.name}发出了叫声`;
  }
}

class Dog extends Animal {
  public breed: string;
  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }
}
```

- `extends`：子类继承父类
- 子类构造函数中，必须先调用 `super(...)` 再使用 `this`

### 2.2 方法重写（override 思维）

```ts
speak(): string {
  const parentSpeak = super.speak();
  return `${parentSpeak}，这只${this.breed}狗在叫`;
}
```

- 子类可以重写父类方法，扩展行为
- `super.speak()` 可复用父类原有逻辑

### 2.3 继承后的成员访问
- 可访问继承而来的 `name`
- 可访问子类自己的 `breed`
- 如果父类成员是 `private`，子类也不能直接访问

---

## 3. 抽象类：抽象属性、抽象方法与多态（abstract-class.ts）

### 3.1 抽象类定义

```ts
abstract class Shape {
  abstract readonly type: string;
  color: string;

  constructor(color: string = "black") {
    this.color = color;
  }

  abstract getArea(): number;

  getColorInfo(): string {
    return `这个${this.type}的颜色是${this.color}`;
  }

  abstract getDescription(): string;
}
```

- `abstract class` 不能直接实例化
- 抽象成员（属性/方法）必须由子类实现
- 抽象类可以包含已实现的普通方法（如 `getColorInfo`）

### 3.2 子类实现抽象成员

```ts
class Circle extends Shape {
  readonly type = "圆形";
  constructor(public radius: number, color?: string) {
    super(color);
  }
  getArea(): number {
    return Math.PI * this.radius ** 2;
  }
  getDescription(): string {
    return `${this.getColorInfo()}，半径=${this.radius}，面积=${this.getArea().toFixed(2)}`;
  }
}
```

```ts
class Rectangle extends Shape {
  readonly type = "矩形";
  constructor(public width: number, public height: number, color?: string) {
    super(color);
  }
  getArea(): number {
    return this.width * this.height;
  }
  getDescription(): string {
    return `${this.getColorInfo()}，宽=${this.width}，高=${this.height}，面积=${this.getArea().toFixed(2)}`;
  }
}
```

### 3.3 多态使用

```ts
const shapes: Shape[] = [circle, rectangle];
shapes.forEach((shape) => {
  console.log(shape.type, shape.getArea());
});
```

- 父类类型数组可存放不同子类对象
- 调用同名方法时，根据实际对象类型执行对应实现

### 3.4 关键理解
- 子类构造参数可以与父类不同（可新增、可重排、可选）
- 但必须保证 `super(...)` 传参满足父类构造函数要求
- 这条规则不仅适用于抽象类，也适用于普通继承

---

## 4. 泛型函数：类型参数、约束与多泛型参数（generic-function.ts）

### 4.1 基础泛型函数

```ts
function identity<T>(value: T): T {
  return value;
}
```

- 输入是什么类型，输出就是什么类型
- 可显式写 `identity<string>(...)`，也可让 TS 自动推断

### 4.2 带约束的泛型

```ts
function pickFirst<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

- `keyof T`：取对象 `T` 的键名联合类型
- `K extends keyof T`：限制 `key` 必须是对象已有键
- `T[K]`：返回该键对应值的类型

### 4.3 多泛型参数

```ts
function createPair<S, T>(first: S, second: T): [S, T] {
  return [first, second];
}
```

- 使用多个类型变量描述多个参数
- 返回元组可精确保留每个位置的类型

---

## 5. 泛型接口：接口泛型化与两种实现方式（generic-interface.ts）

### 5.1 单泛型接口

```ts
interface Container<T> {
  value: T;
  getValue(): T;
}
```

- 接口约束的是“结构”而不是具体实现
- 任何实现者都必须提供 `value` 和 `getValue`，且类型一致

### 5.2 双泛型接口

```ts
interface Pair<S, T> {
  setFirst(v: S): void;
  setSecond(v: T): void;
  getBoth(): [S, T];
}
```

- 适合表达键值对、组合数据等双类型场景

### 5.3 实现方式一：实现时固定类型

```ts
class StringContainer implements Container<string> {
  value: string;
  constructor(initialValue: string) {
    this.value = initialValue;
  }
  getValue(): string {
    return this.value;
  }
}
```

- 优点：简单直接
- 限制：类型固定，只服务于某一类数据

### 5.4 实现方式二：实现时保留泛型

```ts
class PairImpl<S, T> implements Pair<S, T> {
  private first?: S;
  private second?: T;

  setFirst(v: S): void { this.first = v; }
  setSecond(v: T): void { this.second = v; }

  getBoth(): [S, T] {
    return [this.first!, this.second!];
  }
}
```

- 优点：复用性高，类型灵活
- 注意：`!` 非空断言依赖调用顺序，最好先 `set` 再 `get`

---

## 6. 今日总结与易错点

### 6.1 今日核心收获

| 知识点 | 关键结论 |
|------|------|
| 类修饰符 | `public` 默认公开；`private` 仅类内可见；`readonly` 仅初始化时可赋值 |
| 静态成员 | `static` 成员属于类本身，适合全局计数/共享配置 |
| 继承 | 子类构造函数必须先 `super(...)` 再访问 `this` |
| 方法重写 | 子类可重写父类方法，并用 `super.method()` 复用父逻辑 |
| 抽象类 | 不能实例化；抽象成员必须在子类中实现 |
| 多态 | 父类引用可指向子类对象，运行时分派到子类实现 |
| 泛型函数 | 用类型参数提升复用性，且保持类型安全 |
| 泛型约束 | `K extends keyof T` 可约束键名合法，`T[K]` 精确表达返回类型 |
| 泛型接口实现 | 可“固定类型实现”或“保留泛型实现”，按场景选择 |

### 6.2 易错点清单

1. 在子类构造函数里先写 `this.xxx` 再写 `super(...)`（会报错）
2. 把 `private` 属性当作可继承访问成员（实际上子类也不能直接访问）
3. 抽象类当普通类 `new`（不允许）
4. `pickFirst(obj, key)` 中传不存在的键（泛型约束会阻止）
5. 在 `PairImpl` 里未赋值就 `getBoth()`，依赖 `!` 会有运行时风险

### 6.3 一句话总结

今天的内容把 TypeScript 从“类型标注”推进到了“面向对象 + 泛型建模”：既能用类和抽象类组织复杂结构，也能用泛型保持代码复用与类型精确性。

---
