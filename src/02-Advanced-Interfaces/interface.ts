// ===================== 1. 接口声明对象结构 =====================
// 最基础的用法：定义对象的形状（属性和类型）  这个数据是必须还是什么可以看 # ts.function.ts
interface U_ser {
    id : number;
    name : string;
    age : number;
}

// 使用接口约束对象
const userA: U_ser = {
  id: 1,
  name: "张三",
  age: 25
};


// ===================== 2. 可选属性、只读属性 =====================
interface Product {
  readonly id: number;       // 只读属性：初始化后不能修改
  name: string;              // 必选属性
  price: number;             // 必选属性
  desc?: string;             // 可选属性：可以有也可以没有
  stock?: number;            // 可选属性
}

// 使用示例
const product1: Product = {
  id: 1001,
  name: "TypeScript教程",
  price: 99
};

const product2: Product = {
  id: 1002,
  name: "JavaScript教程",
  price: 89,
  desc: "零基础入门",
  stock: 100
};

// 错误示例（修改只读属性）：
// product1.id = 1003; // 报错：Cannot assign to 'id' because it is a read-only property


// ===================== 3. 函数类型接口 =====================
// 方式1：直接定义函数类型
interface AddFunc {
    (a : number, b : number) : number   // 参数类型和返回值类型
}
// 实现定义
const addFunc : AddFunc = (x,y) => x+y;
console.log(addFunc(10,20));


// 方式2：结合对象结构的函数接口（更贴近实际开发）
interface UserService {
  getUserById: (id: number) => U_ser;       // 获取用户
  updateUserName: (id: number, name: string) => boolean; // 更新用户名
}
//实现定义
// 实现接口
const userService: UserService = {           //！！！=====>>>>一般不会直接在单个实例实现    上面这个UserService应该就是个抽象接口，要被继承
  getUserById: (id) => ({ id, name: "默认用户", age: 18 }),
  updateUserName: (id, name) => {
    console.log(`更新用户${id}的名称为：${name}`);
    return true;
  }
};


// ===================== 4. 索引签名 =====================
// 场景：对象的属性名不固定，但属性值类型固定
interface StringDictionary {
// 字符串索引：键是string类型，值是string类型
  [key: string]: string;
}

const dict : StringDictionary = {
    name: "张三",
    city: "北京",
    // 可以动态添加任意字符串键
    gender: "男"
}


// 数字索引：键是number类型，值是指定类型
interface NumberArray {
  [index: number]: number;
}

const arr: NumberArray = [1, 2, 3, 4];
console.log(arr[0]); // 输出：1


// 混合索引（字符串索引是数字索引的超集）
interface MixedDictionary {
  [index: number]: string;  // 数字索引
  [key: string]: string | number; // 字符串索引必须包含数字索引的类型
}

const mixed: MixedDictionary = {
  0: "第一个元素",
  1: "第二个元素",
  name: "混合字典",
  age: 25
};


// ===================== 5. 接口继承 =====================
interface Person {
    name : string;
    age : number
}

//继承Person接口（单继承）
interface Student extends Person {
    studentId : number;
    grade : string;
}

// 使用示例
const student: Student = {
  name: "李四",
  age: 20,
  studentId: 2024001,
  grade: "大一"
};



// 多继承：继承多个接口
interface Worker_ {          //Worker在浏览器环境中是一个内置的全局接口（用于Web Worker）
  company: string;
  salary: number;
}

interface WorkingStudent extends Person, Worker_ {
  major: string;
}

const workingStudent: WorkingStudent = {
  name: "王五",
  age: 22,
  company: "某科技公司",
  salary: 5000,
  major: "计算机科学"
};


// ===================== 6. 接口合并 =====================
// 同名接口会自动合并（仅接口支持，type不支持）
interface Config {
  appName: string;
  version: string;
}

// 再次声明同名接口，会和上面的合并
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


// 函数接口的合并（函数重载）
interface Calculate {
  (a: number, b: number): number;
}

interface Calculate {
  (a: string, b: string): string;
}

// 实现合并后的函数接口
const calculate: Calculate = (a: any, b: any): any => {
  if (typeof a === "number" && typeof b === "number") {
    return a + b;
  }
  if (typeof a === "string" && typeof b === "string") {
    return a + b;
  }
  throw new Error("参数类型不匹配");
};
//test
console.log(calculate(10, 20));    // 输出：30
console.log(calculate("Hello", "TS")); // 输出：HelloTS  