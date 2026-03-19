// ============================ 1. 函数表达式类型 ============================
// 方式1：直接给表达式声明类型（推荐，更直观）
// 变量名: (参数类型) => 返回值类型 = 具体函数
// multiply 是函数名  第一个 ： 分隔函数名与参数类型
const multiply       :       (x : number, y : number) => number         =         (x,y) => x*y;
multiply(3,4);
const sayHello       :       () => string                               =            () => "ajhfsi";
sayHello();
console.log(sayHello());

// const ?? 禁止为函数重新赋值
// multiply = () => {
//     console.log("redefinition");     //报错 : 无法分配到 "multiply" ，因为它是常数。
// }

// 方式2：先定义函数类型别名，再复用（适合复杂函数类型）
// 先定义函数类型、别名、再复用
type CalculateFuc = (a : number, b : number) => number;
const calFuc : CalculateFuc = (x,y) => {
    return x+y;
}
calFuc(111,222);

// ============================ 2. 可选参数、默认参数、剩余参数 ============================
/**
 * 可选参数：参数名后加 ?，必须放在必选参数后面
 * 默认参数：直接给参数赋值，会自动推导类型（也可显式声明）
 * 剩余参数：用 ... 接收多个参数，类型为数组
 */

//区别于前面的函数表达式，下面是函数的   声明式写法
function buildName(
    firstName : string,
    lastName? : string,
    age : number = 18,
    ...hobbies : string[]
) : string {
    let fullName = firstName;
    if(lastName) fullName += `${lastName}`;
    fullName += ` (年龄: ${age})`;
    if(hobbies.length > 0) fullName += `(爱好: ${hobbies.join(", ")})`;
    return fullName;
}

// 调用示例
console.log(buildName("张三")); // 张三 (年龄：18)
console.log(buildName("李四", "小四")); // 李四 小四 (年龄：18)
console.log(buildName("王五", "小五", 20)); // 王五 小五 (年龄：20)
console.log(buildName("赵六", "小六", 22, "篮球", "编程")); // 赵六 小六 (年龄：22)，爱好：篮球, 编程



// ============================ 3. 函数重载 ============================
/**
 * 函数重载：定义多个函数签名（重载列表），实现一个具体函数
 * 作用：让函数根据不同参数类型/个数，返回对应类型的结果，提升类型提示准确性
**/
type hdData = string | number | boolean;
function handleData(data : string) : string;
function handleData(data : number) : number[];
function handleData(data : boolean) : boolean;
// type hdData = string | number | boolean;   // 这个type要是在这里就会报错 ： 函数实现缺失或未立即出现在声明之后。
// TypeScript 函数重载的语法规则——重载签名必须写在实现签名之前，重载签名和实现签名之间不能插入其他代码
function handleData(data : hdData) : string | number[] | boolean {
    if(typeof data === "string") {
        return data.toUpperCase();
    } else if(typeof data === "number") {
        return [data,2*data,3*data];
    } else {
        return !data;
    }
}

// 调用示例（TS会根据入参类型自动推导返回值类型）
const strResult = handleData("hello"); // 类型提示：string → 结果：HELLO
const numResult = handleData(5); // 类型提示：number[] → 结果：[5,10,15]
const boolResult = handleData(true); // 类型提示：boolean → 结果：false
console.log(strResult);
console.log(numResult);
console.log(boolResult);


// ============================ 4. this 类型 ============================
/**
 * this 类型：TS中通过指定this参数（第一个参数），约束函数内this的类型
 * 注意：this参数仅用于类型检查，编译后会被移除，不会实际传递
 */


//定义对象类型
interface User{
    name : string;
    age : number;
    // 方法中指定this类型为User              太强了竟然能指定方法的this类型
    sayHi : (this : User) => void;
    //带参数的方法，this仍放在第一个位置
    updateAge : (this : User, newAge : number) => void;
}


// 创建符合User类型的对象
const user1 : User = {
  name: "小明",
  age: 20,
  sayHi(this: User) {
    // this被约束为User类型，可安全访问name/age
    console.log(`你好，我是${this.name}，今年${this.age}岁`);
  },
  updateAge(this: User, newAge: number) {
    if (newAge < 0 || newAge > 120) throw new Error("年龄不合法");
    this.age = newAge;
    console.log(`年龄已更新为：${this.age}`);
  },
};

// 正确调用：this指向user对象
user1.sayHi(); // 输出：你好，我是小明，今年20岁
user1.updateAge(21); // 输出：年龄已更新为：21

// 注意  在interface中虽然我们写sayHi(this: User)
//但是不能将 this:User直白的理解为传参，这个地方指的是上下文
//就是 下面的引用
user1.sayHi();
//这里的user1就是所谓的上文

// 所以比如
function printAge(this: { age: number }) {   //不能直接传，只能通过 实例.方法()/bind/call/apply 绑定
  console.log(this.age);
}
// 和
function printAge123(age: number) {
  console.log(age);
}
// 这是完全不一样的
// 具体怎么用？？
// 定义一个包含 age 的对象
const person = { age: 20, printAge }; // 把函数挂到对象上
person.printAge();
//（1）使用call   函数.call(thisArg, 参数1, 参数2, ...)
printAge.call(person);
// 带普通参数的场景
function printInfo(this: { age: number }, hobby: string, city: string) {
  console.log(`年龄：${this.age}，爱好：${hobby}，城市：${city}`);
}
// call 绑定 this + 传普通参数（逐个列）
printInfo.call({ age: 25 }, "篮球", "北京"); // 输出：年龄：25，爱好：篮球，城市：北京

//（2）使用apply   函数.apply(thisArg, [参数1, 参数2, ...])
// 复用上面的 printInfo 函数
const person2 = { age: 30 };
const params : [string,string] = ["读书", "上海"]; // 参数数组
printInfo.apply(person2,params);


//（3）使用bind  「绑定 this 后返回新函数」+ 可预设参数 + 不立即执行
// const 新函数 = 原函数.bind(thisArg, 参数1, 参数2, ...)
// 复用 printInfo 函数
const person3 = { age: 22 };
// ✅ 用 bind 绑定 this + 预设第一个参数
const boundPrintInfo = printInfo.bind(person3, "游泳"); 
// 此时 boundPrintInfo 已绑定 this=person3，且第一个参数固定为 "游泳"
// 调用新函数，只需传剩余参数
boundPrintInfo("广州"); // 输出：年龄：22，爱好：游泳，城市：广州
// 绑定 this 后，即使独立调用，this 也不会丢失
const boundPrintAge = printAge.bind({ age: 40, name: "李四" });
boundPrintAge(); // 输出：李四 的年龄是 40（不会报错，this 已固定）



// 额外：箭头函数的this（箭头函数无自己的this，继承外层作用域的this）
const user6 = {
  name: "小红",
  age: 19,
  sayHi: () => {
    // 箭头函数中无法指定this参数，TS会提示：箭头函数不能有'this'参数
    // console.log(`你好，我是${this.name}`); // this指向外层（全局），name为undefined
    // console.log(`箭头函数this：`, this);   //报错：包含箭头函数捕获 "this" 的全局值。
  },
};