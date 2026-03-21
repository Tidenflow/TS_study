// class.ts
//定义Person类
var PersonClass = /** @class */ (function () {
    //constructor：是类的「构造方法」，是语言层面的特殊标识符，
    // 必须用这个名字，且不能加 function
    function PersonClass(name, age) {
        this.name = name;
        this.age = age;
        //为私有属性id赋值（自动生成唯一id）
        this.id = PersonClass.nextId++;
    }
    //实例方法
    // 普通方法（如 introduce、getPersonId）：
    // 类体内部的方法定义采用「简洁语法」，
    // 直接写 方法名(参数) { ... }，
    // 省略 function 关键字（这是语法规定，加了反而不符合规范）；
    PersonClass.prototype.introduce = function () {
        // 方法内部可以访问所有属性（包括 private 的 id）
        return "\u5927\u5BB6\u597D\uFF0C\u6211\u53EB".concat(this.name, "\uFF0C\u4ECA\u5E74").concat(this.age, "\u5C81\uFF0C\u6211\u7684\u5185\u90E8\u7F16\u53F7\u662F").concat(this.id, "\u3002");
    };
    // 可选：获取私有 id 的公共方法（演示私有属性的访问方式）
    PersonClass.prototype.getPersonId = function () {
        return this.id;
    };
    //静态属性： 用于生成唯一的id（辅助演示private属性）
    //这个和C++基本上是一样，就是静态成员变量
    PersonClass.nextId = 1;
    return PersonClass;
}());
// ------------------- 测试代码 -------------------
// 创建 Person 实例
var personE1 = new PersonClass("张三", 25);
var personE2 = new PersonClass("李四", 30);
// 测试公共属性和方法
console.log(personE1.name); // 输出：张三
console.log(personE1.introduce()); // 输出：大家好，我叫张三，今年25岁，我的内部编号是1。
console.log(personE2.introduce()); // 输出：大家好，我叫李四，今年30岁，我的内部编号是2。
console.log(personE1.age);
// 测试 readonly 属性（不可修改）
// person1.age = 26; // ❌ 报错：无法分配到 "age"，因为它是只读属性
// 测试 private 属性（外部无法访问）
// console.log(person1.id); // ❌ 报错：属性“id”为私有属性，只能在类“Person”中访问
// 通过公共方法获取私有属性
console.log(personE1.getPersonId()); // 输出：1
