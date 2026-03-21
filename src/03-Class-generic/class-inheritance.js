// class-inheritance.ts
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Animal = /** @class */ (function () {
    function Animal(name) {
        this.name = name;
        console.log("\u521B\u5EFA\u4E86\u540D\u4E3A".concat(this.name, "\u7684\u52A8\u7269"));
    }
    //定义方法speak
    Animal.prototype.speak = function () {
        return "".concat(this.name, "\u53D1\u51FA\u4E86\u53EB\u58F0");
    };
    return Animal;
}());
var Dog = /** @class */ (function (_super) {
    __extends(Dog, _super);
    //子类构造函数
    function Dog(name, breed) {
        //此处需要先唤醒（调用）父类的构造函数！！！
        var _this = _super.call(this, name) || this;
        _this.breed = breed;
        console.log("Dog\u6784\u9020\u51FD\u6570\u6267\u884C: \u521B\u5EFA\u4E86\u54C1\u79CD\u4E3A".concat(_this.breed, "\u7684\u72D7"));
        return _this;
    }
    //重写父类的speak方法
    Dog.prototype.speak = function () {
        //super.speak() 调用父类的speak方法
        _super.prototype.speak.call(this);
        var parentSpeak = _super.prototype.speak.call(this);
        return "".concat(parentSpeak, "  ,\u8FD9\u53EA\u53EB").concat(this.name, "\u7684").concat(this.breed, "\u72D7\u5728\u53EB");
    };
    // 额外演示：自定义方法中使用 super
    Dog.prototype.introduce = function () {
        // 在普通方法中也可以通过 super 调用父类属性/方法
        return "\u6211\u662F ".concat(this.name, "\uFF0C\u4E00\u53EA ").concat(this.breed, " \u72D7\uFF0C").concat(this.speak());
    };
    return Dog;
}(Animal));
var jinMao = new Dog("旺财", "金毛");
// 调用重写后的 speak 方法
jinMao.speak();
// 输出：旺财 发出了叫声，这只 金毛 狗在叫！
// 调用自定义方法（内部使用 super）
console.log(jinMao.introduce());
// 输出：我是 旺财，一只 金毛 狗，旺财 发出了叫声，这只 金毛 狗汪汪叫！
// 访问继承自父类的属性
console.log("\u72D7\u7684\u540D\u5B57\uFF1A".concat(jinMao.name));
// 输出：狗的名字：旺财
// 访问子类自身的属性
console.log("\u72D7\u7684\u54C1\u79CD\uFF1A".concat(jinMao.breed));
// 输出：狗的品种：金毛
