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
// 定义抽象类 Shape
var Shape = /** @class */ (function () {
    // 构造函数：初始化具体属性
    function Shape(color) {
        if (color === void 0) { color = "black"; }
        this.color = color;
    }
    // 具体方法：抽象类中可以包含已实现的方法
    Shape.prototype.getColorInfo = function () {
        return "\u8FD9\u4E2A".concat(this.type, "\u7684\u989C\u8272\u662F").concat(this.color);
    };
    return Shape;
}());
// 定义 Circle 类，继承并实现 Shape 抽象类
var Circle = /** @class */ (function (_super) {
    __extends(Circle, _super);
    // 构造函数
    function Circle(radius, color) {
        var _this = _super.call(this, color) || this; // 调用父类构造函数初始化 color
        // 实现抽象属性
        _this.type = "圆形";
        _this.radius = radius;
        return _this;
    }
    // 实现抽象方法：计算圆形面积
    Circle.prototype.getArea = function () {
        // 圆的面积公式：π * r²
        return Math.PI * Math.pow(this.radius, 2);
    };
    // 实现抽象方法：获取图形描述
    Circle.prototype.getDescription = function () {
        return "".concat(this.getColorInfo(), "\uFF0C\u534A\u5F84\u4E3A").concat(this.radius, "\uFF0C\u9762\u79EF\u4E3A").concat(this.getArea().toFixed(2));
    };
    return Circle;
}(Shape));
// 定义 Rectangle 类，继承并实现 Shape 抽象类
var Rectangle = /** @class */ (function (_super) {
    __extends(Rectangle, _super);
    // 构造函数
    function Rectangle(width, height, color) {
        var _this = _super.call(this, color) || this; // 调用父类构造函数
        // 实现抽象属性
        _this.type = "矩形";
        _this.width = width;
        _this.height = height;
        return _this;
    }
    // 实现抽象方法：计算矩形面积
    Rectangle.prototype.getArea = function () {
        // 矩形面积公式：宽 * 高
        return this.width * this.height;
    };
    // 实现抽象方法：获取图形描述
    Rectangle.prototype.getDescription = function () {
        return "".concat(this.getColorInfo(), "\uFF0C\u5BBD\u4E3A").concat(this.width, "\uFF0C\u9AD8\u4E3A").concat(this.height, "\uFF0C\u9762\u79EF\u4E3A").concat(this.getArea().toFixed(2));
    };
    return Rectangle;
}(Shape));
// 测试代码：验证抽象类的使用
function testAbstractClass() {
    // 1. 创建圆形实例
    var circle = new Circle(5, "红色");
    console.log("=== 圆形信息 ===");
    console.log(circle.getDescription()); // 输出：这个圆形的颜色是红色，半径为5，面积为78.54
    // 2. 创建矩形实例
    var rectangle = new Rectangle(4, 6, "蓝色");
    console.log("\n=== 矩形信息 ===");
    console.log(rectangle.getDescription()); // 输出：这个矩形的颜色是蓝色，宽为4，高为6，面积为24.00
    // 3. 验证抽象类无法实例化（取消注释会报错）
    // const shape = new Shape(); // Error: Cannot create an instance of an abstract class
    // 4. 多态使用：父类类型接收子类实例
    var shapes = [circle, rectangle];
    console.log("\n=== 所有图形面积汇总 ===");
    shapes.forEach(function (shape, index) {
        console.log("\u56FE\u5F62".concat(index + 1, "\uFF08").concat(shape.type, "\uFF09\uFF1A\u9762\u79EF = ").concat(shape.getArea().toFixed(2)));
    });
}
// 执行测试
testAbstractClass();
// 收获：
/*
1.C++的抽象类是看有无纯虚函数还是虚函数，
但是这个ts需要使用abstract声明对吧
===>  C++ 有纯虚函数是抽象类  只有虚函数是多态

2. 抽象属性（TypeScript 中抽象属性需要在子类中实现）
// 属性怎么说实现呢？？？你的意思是不是说赋值？？？
===>是这样   应该是叫  在子类中显式声明并初始化该抽象属性

3.
// // 构造函数
  constructor(radius: number, color?: string) {
    super(color); // 调用父类构造函数初始化 color
    this.radius = radius;
  }构造函数中可以对抽象类的构造函数参数重新设置吗？？
  就是抽象类已经说了color要有这个参数，
  但是下面子类的构造函数参数竟然给这个改成了可选？？？是
  只有抽象类和子类能这样吗？？还是说普通的类继承也可以这样？？

  （1）子类构造函数的参数设计完全独立于父类，
   你可以自由设置参数的可选性、顺序、类型（只要最终能给父类构造函数传对参数）；
  （2）这不是抽象类独有的特性，普通类的继承也完全适用；
  （3）核心约束只有一个：子类构造函数第一行必须调用 super()，
   且传给 super() 的参数要匹配父类构造函数的要求。

*/ 
