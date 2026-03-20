// practice/basic.ts
//判断用户是admin还是user
var pc1_user1 = {
    id: 1,
    role: "admin",
    status: "SUCESS",
    email: "@123",
    formatUser: function (role, status) {
        if (status === "SUCESS") {
            return "User".concat(this.id, " is ").concat(this.role);
        }
        else
            return "Error, status wrong";
    },
    printInfo: function () {
        var model = "id : ".concat(this.id, " \nrole : ").concat(this.role, " \n");
        if (this.email)
            model += "email : ".concat(this.email, " ");
        console.log(model);
    }
};
pc1_user1.printInfo();
pc1_user1.formatUser(pc1_user1.role, pc1_user1.status);
var pc1_user2 = {
    id: 1,
    role: "user",
    status: "SUCESS",
    formatUser: function (role, status) {
        if (status === "SUCESS") {
            return "User".concat(this.id, " is ").concat(this.role);
        }
        else
            return "Error, status wrong";
    },
    printInfo: function () {
        var model = "id : ".concat(this.id, " \nrole : ").concat(this.role, " \n");
        if (this.email)
            model += "email : ".concat(this.email, " ");
        console.log(model);
    }
};
pc1_user2.printInfo();
pc1_user2.formatUser(pc1_user1.role, pc1_user1.status);
/*
收获：
（1）Interface  里面不能写函数的实现，我第一次在pc1_User这个Interface中去实现formatUser函数就直接报错
（2）Interface  里面也不能写const，就是只能写声明   感觉有点像C++的基类但是只是类似
特性	C++ 基类	TS interface
存在于运行时	✅	❌
有内存布局	✅	❌
有方法实现	✅	❌
允许虚函数	✅	❌
只是约束结构	❌	✅

（3）解决上面formatUser函数的问题，我们的方法是：
    1.现在interfa中声明
    2.在pc1_user1这个实例对象里面去实现
只是说这样的效率会比较低
为什么我们说interface里面不能写实现呢？？？因为interface编译时消失，在运行时根本不存在

如果说不想在实例中实现，就是想提高复用性，那么
    1.用 class
    2.interface + 公共函数   将函数声明从interface中去除，在外部实现formatUser函数称为公共函数
    3.使用工厂函数  👉 用一个函数来“生产对象”
    function createUser(
  id: number,
  role: UserRole,
  status: boolean
  ) {
  return {
    id,
    role,
    status,

    formatUser(newRole: UserRole, apiStatus: ApiStatus) {
      if (apiStatus === "SUCCESS") {
        this.role = newRole;
        return this;
      }
      throw new Error("User not found");
    }
  };
}

*/
/*
但是没有用到  as const我实在是没想好哪里可以用到
这里来总结一下用法吧
1.最基础：
          let role = "admin";
role在这里的类型应该是 string而不是"amdin" 因为ts认为后面可能重新赋值
但是加上 as const  就不一样了
          let role = "admin" as const;
现在类型就变成了  "admin"

2.在的对象里的作用
         const user = {
         role: "admin"
         };
类型是
        {
         role: string
        }
但是加上as const
        const user = {
        role : "admin"
        } as const;
就变成
        {
        readonly role : "admin";
        }

3.数组里更重要
const roles = ["admin", "user"];
类型就是string[]
但是  写成  const roles = ["admin", "user"] as const;
类型就变成 readonly ["admin", "user"]

4.超级常见用法：自动生成联合类型
const roles = ["admin", "user"] as const;
type UserRole = typeof roles[number];
type UserRole = "admin" | "user";
*/
var roles_ = ["admin", "user"];
//type UserRole_ = "admin" | "user"; 悬在UserRole上面可以看到
console.log(roles_);
//console.log(typeof UserRole);报错：UserRole_ 仅表示类型，但在此处却作为值使用
//因为这个UserRole在编译后就没有了
