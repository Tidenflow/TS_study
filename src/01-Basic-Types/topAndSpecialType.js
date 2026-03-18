//  any 就是放弃类型检查
console.log("===1.any 放弃类型检查===");
var value = "hello";
//  value 可以重新赋值
value = 123;
console.log(value);
value = true;
console.log(value); //输出true
console.log(typeof (value)); //输出boolean
console.log(value.length); //   编辑时不报错  输出undefined
// value.toFixed();             //   编辑时不报错  运行报错  TypeError: value.toFixed is not a function
console.log("===2.unknown 安全的顶级类型===");
var value1 = "hello";
// console.log(value1.length);  //  编辑时会报错 “value1”的类型为“未知”。
value1 = 123;
console.log(value);
value1 = true;
console.log(value);
console.log(typeof (value1));
// console.log(value1.length); // 编辑时会报错 “value1”的类型为“未知”。
// value1.length;  //  编辑时会报错 “value1”的类型为“未知”。  unknown类型不能直接访问length
//value1.toFixed();  //  编辑时会报错 “value1”的类型为“未知”。
//上面的length怎么访问length？？
//使用  断言
//断言：手动告诉 TS“别按你推断的类型来，按我指定的类型校验   
//下面这个就是告诉编译器  这个value1是string  别自己判断了
console.log(value1.length); // 但是boolean没有length属性，所以输出 undefined
//所以使用unknown更加的安全
console.log("===3.void  没有返回值===");
function logMessage() {
    console.log("hello");
}
logMessage();
console.log("===4.never 永远不可能===");
//我们先看什么是普通函数
// 1. 有明确返回值
function add(a, b) {
    return a + b; // 执行到 return，函数正常结束，返回 number
}
// 2. 无返回值（隐式返回 undefined）
function sayHi() {
    console.log("hi");
    // 没有 return，但函数执行完会“隐式返回 undefined”，依然是正常结束
}
// 2.返回 never 的函数（“永远不结束”）
//    (1) 情况 1：永远抛异常（执行被中断）
/*
function throwError() : never {
    // throw new Error("Stop");                                          //调试的时候在这里注释  要不然直接停了
    // 执行到 throw 时，函数立即终止，永远到不了“返回”这一步
    // 后面哪怕写代码，也永远不会执行
    // 下面变成阴影
    // 这里是  代码可达性检查（unreachable）
    // 就像 TS 在说："这段代码永远跑不到"，然后把文字变灰色
    console.log("这段代码永远执行不到"); // TS 会提示：Unreachable code
}
    */
// const res = throwError();  // 其实这里这个res 应该是 never
//    (2) 情况 2：死循环（执行永远不停止）
function infiniteLoop() {
    while (true) {
        // 循环永远不结束，函数执行流程被“卡”在循环里，永远到不了返回步骤
    }
}
// 下面这个 value : string | number 不会被上面影响，即使上面是 let value : string = "value"也没事
// 因为这个作用域不同
// 上面那个是文件作用域
// 下面这个是函数作用域
function test(value) {
    if (typeof value === "string") {
        console.log("string");
    }
    else if (typeof value === "number") {
        console.log("number");
    }
    else {
        // 这里为什么没有变阴影？？
        // 因为这里是类型检查   （value 是 never）
        // TS 说：这里永远没值，类型是 never   就像 TS 在说："我知道这个分支不可能被执行"
        value; // 类型为 never
        //if(typeof value !== "never") {    //  ====>>>这里报错 ： 此比较似乎是无意的，因为类型
        //  “"string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"”和“"never"”没有重叠。
        //  上面这个报错是什么意思呢？？  如下
        // 你在 else 分支里写 typeof value !== "never" 是完全无意义的，
        // 因为此时 value 的类型已经被 TS 推断为 never，根本不可能和任何 typeof 的结果（比如 "never"）有重叠。
        // }
        console.log("value不是string也不是number");
    }
}
console.log("===今日实验===");
console.log("===unknown禁止直接访问===");
var value2 = "Tom";
console.log(typeof value2);
// console.log(value2.length);  此时编辑器一定会报错
// 但是我都知道这就是字符"Tom"我怎么访问length呢？？
// 方式1   类型判断
if (typeof value2 === "string") {
    console.log(value2.length); // ✅
}
// 方式2   断言
console.log(value2.length);
