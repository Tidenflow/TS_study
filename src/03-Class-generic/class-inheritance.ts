// class-inheritance.ts

class Animal {
    public name : string;

    constructor(name : string) {
        this.name = name;
        console.log(`创建了名为${this.name}的动物`);
    }

    //定义方法speak

    speak() : string {
        return `${this.name}发出了叫声`;
    }
}

class Dog extends Animal {
    //子类新增属性breed（品种）
    public breed : string;

    //子类构造函数
    constructor(name : string, breed : string) {
        //此处需要先唤醒（调用）父类的构造函数！！！
        super(name);
        this.breed = breed;
        console.log(`Dog构造函数执行: 创建了品种为${this.breed}的狗`);
    }

    //重写父类的speak方法
    speak() : string {
        //super.speak() 调用父类的speak方法
        super.speak();
        const parentSpeak = super.speak();
        return `${parentSpeak}  ,这只叫${this.name}的${this.breed}狗在叫`;
    }

     // 额外演示：自定义方法中使用 super
    introduce(): string {
     // 在普通方法中也可以通过 super 调用父类属性/方法
       return `我是 ${this.name}，一只 ${this.breed} 狗，${this.speak()}`;
    }
}


const jinMao = new Dog("旺财","金毛");
// 调用重写后的 speak 方法
jinMao.speak();
// 输出：旺财 发出了叫声，这只 金毛 狗在叫！

// 调用自定义方法（内部使用 super）
console.log(jinMao.introduce());
// 输出：我是 旺财，一只 金毛 狗，旺财 发出了叫声，这只 金毛 狗汪汪叫！

// 访问继承自父类的属性
console.log(`狗的名字：${jinMao.name}`);
// 输出：狗的名字：旺财

// 访问子类自身的属性
console.log(`狗的品种：${jinMao.breed}`);
// 输出：狗的品种：金毛
