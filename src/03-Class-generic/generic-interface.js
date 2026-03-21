// ==================== 实现方式1：实现时指定具体类型 ====================
/**
 * StringContainer：实现 Container<string>（指定 T 为 string）
 * 特点：接口的泛型参数被固定为 string，类只能处理字符串类型
 */
var StringContainer = /** @class */ (function () {
    function StringContainer(initialValue) {
        this.value = initialValue;
    }
    // 实现 getValue 方法，返回 string 类型
    StringContainer.prototype.getValue = function () {
        return this.value;
    };
    return StringContainer;
}());
// ==================== 实现方式2：实现时保留泛型 ====================
/**
 * PairImpl：实现 Pair<S, T>（保留泛型参数 S、T）
 * 特点：类本身也是泛型类，适配任意类型的键值对
 */
var PairImpl = /** @class */ (function () {
    function PairImpl() {
    }
    // 实现 setFirst 方法，接收 S 类型的参数
    PairImpl.prototype.setFirst = function (v) {
        this.first = v;
    };
    // 实现 setSecond 方法，接收 T 类型的参数
    PairImpl.prototype.setSecond = function (v) {
        this.second = v;
    };
    // 实现 getBoth 方法，返回 [S, T] 元组
    PairImpl.prototype.getBoth = function () {
        // 非空断言（!）：确保调用 getBoth 前已设置值
        return [this.first, this.second];
    };
    return PairImpl;
}());
// ==================== 测试代码 ====================
function testGenericInterface() {
    // 1. 测试「指定类型」的实现（StringContainer）
    console.log("=== 测试 StringContainer（指定类型实现） ===");
    var strContainer = new StringContainer("Hello Generic Interface");
    console.log("初始值：", strContainer.getValue()); // Hello Generic Interface
    strContainer.value = "TypeScript 泛型接口";
    console.log("修改后值：", strContainer.getValue()); // TypeScript 泛型接口
    // 2. 测试「保留泛型」的实现（PairImpl）
    console.log("\n=== 测试 PairImpl（保留泛型实现） ===");
    // 显式指定 S 为 number，T 为 string
    var numberStringPair = new PairImpl();
    numberStringPair.setFirst(100);
    numberStringPair.setSecond("泛型接口测试");
    console.log("数字+字符串对：", numberStringPair.getBoth()); // [100, "泛型接口测试"]
    // 隐式推导 S 为 boolean，T 为 object
    var boolObjPair = new PairImpl();
    boolObjPair.setFirst(true);
    boolObjPair.setSecond({ id: 1, name: "张三" });
    console.log("布尔+对象对：", boolObjPair.getBoth()); // [true, { id: 1, name: "张三" }]
}
// 执行测试
testGenericInterface();
