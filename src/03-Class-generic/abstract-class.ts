// 定义抽象类 Shape
abstract class Shape {
  // 抽象属性（TypeScript 中抽象属性需要在子类中实现）
  abstract readonly type: string; // 图形类型（如"圆形"、"矩形"）
  
  // 具体属性（有默认值）
  color: string;

  // 构造函数：初始化具体属性
  constructor(color: string = "black") {
    this.color = color;
  }

  // 抽象方法：必须在子类中实现
  abstract getArea(): number;

  // 具体方法：抽象类中可以包含已实现的方法
  getColorInfo(): string {
    return `这个${this.type}的颜色是${this.color}`;
  }

  // 抽象方法：获取图形描述
  abstract getDescription(): string;
}

// 定义 Circle 类，继承并实现 Shape 抽象类
class Circle extends Shape {
  // 实现抽象属性
  readonly type: string = "圆形";
  
  // 自有属性：半径
  radius: number;

  // 构造函数
  constructor(radius: number, color?: string) {
    super(color); // 调用父类构造函数初始化 color
    this.radius = radius;
  }

  // 实现抽象方法：计算圆形面积
  getArea(): number {
    // 圆的面积公式：π * r²
    return Math.PI * Math.pow(this.radius, 2);
  }

  // 实现抽象方法：获取图形描述
  getDescription(): string {
    return `${this.getColorInfo()}，半径为${this.radius}，面积为${this.getArea().toFixed(2)}`;
  }
}

// 定义 Rectangle 类，继承并实现 Shape 抽象类
class Rectangle extends Shape {
  // 实现抽象属性
  readonly type: string = "矩形";
  
  // 自有属性：宽、高
  width: number;
  height: number;

  // 构造函数
  constructor(width: number, height: number, color?: string) {
    super(color); // 调用父类构造函数
    this.width = width;
    this.height = height;
  }

  // 实现抽象方法：计算矩形面积
  getArea(): number {
    // 矩形面积公式：宽 * 高
    return this.width * this.height;
  }

  // 实现抽象方法：获取图形描述
  getDescription(): string {
    return `${this.getColorInfo()}，宽为${this.width}，高为${this.height}，面积为${this.getArea().toFixed(2)}`;
  }
}

// 测试代码：验证抽象类的使用
function testAbstractClass() {
  // 1. 创建圆形实例
  const circle = new Circle(5, "红色");
  console.log("=== 圆形信息 ===");
  console.log(circle.getDescription()); // 输出：这个圆形的颜色是红色，半径为5，面积为78.54

  // 2. 创建矩形实例
  const rectangle = new Rectangle(4, 6, "蓝色");
  console.log("\n=== 矩形信息 ===");
  console.log(rectangle.getDescription()); // 输出：这个矩形的颜色是蓝色，宽为4，高为6，面积为24.00

  // 3. 验证抽象类无法实例化（取消注释会报错）
  // const shape = new Shape(); // Error: Cannot create an instance of an abstract class

  // 4. 多态使用：父类类型接收子类实例
  const shapes: Shape[] = [circle, rectangle];
  console.log("\n=== 所有图形面积汇总 ===");
  shapes.forEach((shape, index) => {
    console.log(`图形${index + 1}（${shape.type}）：面积 = ${shape.getArea().toFixed(2)}`);
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