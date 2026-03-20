// practice/this-and-interface.ts
var student1 = {
    id: 1,
    hobby: ["唱歌", "跳", "Rap"],
    age: 18,
    updateAge: function (age) {
        console.log("===== 当前调用的 this 上下文 =====");
        console.log("id:", this.id);
        console.log("hobby:", this.hobby);
        console.log("原 age:", this.age);
        console.log("要更新的 age:", age);
        // 实际更新 age（可选，演示核心逻辑）
        this.age = age;
        console.log("更新后的 age:", this.age);
        console.log("==================================\n");
    }
};
// 额外定义一个学生对象（用于演示 call/apply/bind 切换 this）
var student2 = {
    id: 2,
    hobby: ["篮球", "游戏"],
    age: 20,
    updateAge: student1.updateAge // 复用同一个方法实现
};
// ========== 方式 1：挂载到对象上直接调用（最常用） ==========
console.log("【方式 1：对象直接调用】");
student1.updateAge(20); // this 指向 student1，参数直接传递
// ========== 方式 2：使用 call 调用（手动指定 this + 参数逐个传递） ==========
console.log("【方式 2：call 调用】");
// 语法：函数.call(thisArg, arg1, arg2, ...)
// this 指向 student2，参数 22 逐个传递
student1.updateAge.call(student2, 22); //this指向student2
// ========== 方式 3：使用 apply 调用（手动指定 this + 参数以数组传递） ==========
console.log("【方式 3：apply 调用】");
// 语法：函数.apply(thisArg, [arg1, arg2, ...])
// this 指向 student2，参数 25 放在数组中传递
student1.updateAge.apply(student2, [25]); //this指向student2
// ========== 方式 4：使用 bind 绑定 this（返回新函数，不立即执行） ==========
console.log("【方式 4：bind 绑定】");
// 步骤 1：绑定 this 为 student1，并预设第一个参数为 30
// 语法：函数.bind(thisArg, 预设参数1, 预设参数2, ...)
var bindUpdateAge = student1.updateAge.bind(student1, 30); //this指向student1
// 步骤 2：执行绑定后的新函数（此时 this 固定为 student1，参数已预设）
console.log("执行 bind 后的函数（预设参数 30）：");
bindUpdateAge(); // 无需再传 age 参数（已预设）
// 扩展：bind 也可以只绑定 this，不预设参数，调用时传参
var bindStudent2 = student1.updateAge.bind(student2);
console.log("执行 bind student2 后的函数（调用时传参 28）：");
bindStudent2(28); // 调用时传递参数 28  //this指向student2
