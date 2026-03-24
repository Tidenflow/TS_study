const aaa = {
    name : "Auth",
    dependencies : ["str","ausihf","easjf"]
}


//every = 每一个都满足，才返回 true
// const is_true_ : boolean = aaa.dependencies.every(depId => depId in ["str","iefh"]);
// if(is_true_) console.log("YES1");
// const is_true1_ : boolean = aaa.dependencies.every(depId => depId in ["str","ausihf","easjf"]);
// if(is_true1_) console.log("YES2");
// 上面的全部都打印不出来  因为 in 不能用来检查「数组里有没有元素」  in 只能检查「对象有没有这个 key」
// "str" 不可能成为下标志

const bbb = {
    name : "Auth",
    dependencies : [1,2,3]
}
const is_true2_ : boolean = bbb.dependencies.every(depId => depId in [1,2,3,4]);
if(is_true2_) console.log("bbbYES1");  //输出


//那上面那个怎么写才行呢？？
//使用includes()
const is_true_ : boolean = aaa.dependencies.every(depId => ["str","iefh"].includes(depId));
if(is_true_) console.log("YES1");
const is_true1_ : boolean = aaa.dependencies.every(depId => ["str","ausihf","easjf"].includes(depId));
if(is_true1_) console.log("YES2");  //输出