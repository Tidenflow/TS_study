/**
 * 1. 基础泛型接口：容器接口（单泛型参数）
 * T：类型变量，代表容器中值的类型
 */
interface Container<T> {
  value: T; // 存储任意类型的值   这里不是声明变量
  //这里是说：使用 Container<T> 泛型接口时，
  // 实现类必须满足「拥有一个名为 value、类型为 T 的可访问属性」的规则 
  // —— 不一定是「直接声明一个 T 类型的变量」，
  // 但必须让外部能访问到 obj.value 且类型匹配 T。
  getValue(): T; // 返回值的类型和 value 一致


//  类型可以兼容、不可以不匹配
//  接口要求 T 是 string，实现类用更具体的子类型（比如 "red" | "blue"）
//   class ColorContainer implements Container<string> {
//   value: "red" | "blue" = "red"; // 合法："red" | "blue" 是 string 的子类型
// }
}

/**
 * 2. 多泛型参数接口：键值对接口
 * S：第一个值的类型
 * T：第二个值的类型
 */
interface Pair<S, T> {
  setFirst(v: S): void; // 设置第一个值
  setSecond(v: T): void; // 设置第二个值
  getBoth(): [S, T]; // 返回包含两个值的元组
}

// ==================== 实现方式1：实现时指定具体类型 ====================
/**
 * StringContainer：实现 Container<string>（指定 T 为 string）
 * 特点：接口的泛型参数被固定为 string，类只能处理字符串类型
 */
class StringContainer implements Container<string> {
  // 必须匹配 Container<string> 的类型：value 为 string
  value: string;

  constructor(initialValue: string) {
    this.value = initialValue;
  }

  // 实现 getValue 方法，返回 string 类型
  getValue(): string {
    return this.value;
  }
}

// ==================== 实现方式2：实现时保留泛型 ====================
/**
 * PairImpl：实现 Pair<S, T>（保留泛型参数 S、T）
 * 特点：类本身也是泛型类，适配任意类型的键值对
 */
class PairImpl<S, T> implements Pair<S, T> {
  private first?: S; // 私有属性存储第一个值
  private second?: T; // 私有属性存储第二个值

  // 实现 setFirst 方法，接收 S 类型的参数
  setFirst(v: S): void {
    this.first = v;
  }

  // 实现 setSecond 方法，接收 T 类型的参数
  setSecond(v: T): void {
    this.second = v;
  }

  // 实现 getBoth 方法，返回 [S, T] 元组
  getBoth(): [S, T] {
    // 非空断言（!）：确保调用 getBoth 前已设置值
    return [this.first!, this.second!];
  }
}

// ==================== 测试代码 ====================
function testGenericInterface() {
  // 1. 测试「指定类型」的实现（StringContainer）
  console.log("=== 测试 StringContainer（指定类型实现） ===");
  const strContainer = new StringContainer("Hello Generic Interface");
  console.log("初始值：", strContainer.getValue()); // Hello Generic Interface
  strContainer.value = "TypeScript 泛型接口";
  console.log("修改后值：", strContainer.getValue()); // TypeScript 泛型接口

  // 2. 测试「保留泛型」的实现（PairImpl）
  console.log("\n=== 测试 PairImpl（保留泛型实现） ===");
  // 显式指定 S 为 number，T 为 string
  const numberStringPair = new PairImpl<number, string>();
  numberStringPair.setFirst(100);
  numberStringPair.setSecond("泛型接口测试");
  console.log("数字+字符串对：", numberStringPair.getBoth()); // [100, "泛型接口测试"]

  // 隐式推导 S 为 boolean，T 为 object
  const boolObjPair = new PairImpl();
  boolObjPair.setFirst(true);
  boolObjPair.setSecond({ id: 1, name: "张三" });
  console.log("布尔+对象对：", boolObjPair.getBoth()); // [true, { id: 1, name: "张三" }]
}

// 执行测试
testGenericInterface();