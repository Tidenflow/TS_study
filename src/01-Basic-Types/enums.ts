//数字枚举
console.log("===数字枚举===");
enum Direction{
    Up,
    Down,
    Left,
    Right
}
//从下面这个打印结果可以看出来这是双向映射
console.log(Direction);

let dir : Direction = Direction.Up;
console.log(dir);


let Dir : Direction;
//上面只是点明  使用什么枚举类型
Dir = Direction.Left;
console.log(Dir);
console.log(Direction[Dir]);


//字符串枚举
console.log("\n");
console.log("===字符串枚举===");
enum Status {
  Success = "SUCCESS",
  Error = "ERROR"
}
console.log(Status);
// ✅ 没有反向映射
// ✅ 可读性好
// ✅ 常用于后端状态
let statusDir : Status = Status.Success;
console.log(statusDir);
let status1 : Status;
status1 = Status.Error;
console.log(status1);


//常量枚举
console.log("===常量枚举===");
// TS 源码
const enum Direction1 {
  Up, Down, Left, Right
}
// console.log(Direction1);  //编辑时报错 ： "const" 枚举仅可在属性、索引访问表达式、导入声明的右侧、导出分配或类型查询中使用。
//为什么不能 console.log(Direction1)？
//因为编译后根本没有 Direction1 这个变量，只剩 0、1 这样的数字了。
console.log(Direction1.Down);
let dir3 = Direction1.Right;
console.log(dir3);
