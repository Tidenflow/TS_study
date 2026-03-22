// training_260322.ts
//实现学生任务管理器 StudentTaskManager

//   1.类型与枚举定义
//(1)状态枚举
enum TaskStatus {
    TODO,
    IN_PROGRESS,
    DONE
} 
//(2)优先级类型
type Priority = "low" | "middle" | "high";


//  2.基础接口
// 基础任务接口   ====>>  规定我们一个"任务"应该包含的基本属性
interface ITaskBase {
    readonly id : number;   //只读参数
    title : string;
    status : TaskStatus;
    priority : Priority;
    tags? : string;     //可选参数
}

// 这是一个函数接口吗？？？ 下面好像没用到
interface IDescribe {
    getSummary(this : IDescribe) : string;
}

//  集合接口？？？
interface IDictionary {
    [key : string] : string | number;
}

//  3.泛型接口
interface IRepository<T> {
    add(item : T) : void;
    removeById(id : number) : boolean;
    getById(id : number) : T | undefined;
    getAll() : T[];
}


//  4.实现抽象类
abstract class AbstractTask {
    // public title : string;
    // public status : TaskStatus;
    // public priority : Priority;
    // public tags? : string;
    // readonly id : number;
    public data : ITaskBase; 

    constructor(data : ITaskBase){
        // this.id = id;
        // this.title = title;
        // this.status = status;
        // this.priority = priority;
        this.data = data;
    }

    abstract getSummary() : string;   //抽象属性只能由子类实现
    markDone() : void {
        let mark : string = `MarkDone Info:\nid = ${this.data.id}\ntitle =${this.data.title}\nstatus =${this.data.status}\npriority =${this.data.priority}\n`;
        if(this.data.tags) mark += `tags =${this.data.tags}`;
        console.log(mark);
    }
}

//  5.实现子类一
class NormalTask extends AbstractTask {
    public deadline? :Date;


    constructor(data : ITaskBase,deadline : Date) {
        //此处怎么进行唤醒？？？  上面参数要加上  data : ITaskBase
        super(data);
        this.deadline = deadline;
    }

    getSummary(): string {
        return `(子类NormalTask)Task${this.data.id}重写getSummary函数`;
    }
}

//  6.实现子类二
class ExamTask extends AbstractTask {
    public subject : string;
    public score : number;

    // 修正：构造函数需要接收 ITaskBase + 子类专属属性（刚才这里没写构造函数）
    constructor(data: ITaskBase, subject: string, score: number) {
        super(data);
        this.subject = subject;
        this.score = score;
    }

    getSummary(): string {
        return `(子类ExamTask)Task${this.data.id}重写getSummary函数`;
    }
}


//  7.核心管理类
class TaskManager implements IRepository<AbstractTask>{
    //注意这个tasks就是模拟任务列表的
    private tasks : AbstractTask[] = [];
    private static  nextId = 1;

    //生成唯一的id
    private createId() : number {
        //下面这个是错误写法，这样写第一个id是2
        // TaskManager.nextId++;
        // return TaskManager.nextId;
        const current_id = TaskManager.nextId;
        TaskManager.nextId++;
        return current_id;
    }

    //实现仓库接口的全部方法
    //(1)添加任务
    add(item : AbstractTask) : void{
        //安全校验：避免重复添加任务、比面空任务
        if(!item || this.getById(item.data.id)) {
            console.warn(`任务ID ${item.data.id} 已存在，添加失败`);
            return;
        }
        this.tasks.push(item);
        console.log(`任务ID ${item.data.id} 添加成功`);
    }


    //根据id删除任务
    removeById(id : number) : boolean{
        //先找出任务索引（id）
        const taskIndex = this.tasks.findIndex(task => task.data.id === id); 
        //找不到匹配元素固定返回 -1
        if (taskIndex === -1) {
            console.warn(`任务ID ${id} 不存在，删除失败`);
            return false; // 删除失败返回false
        }
        // 删除对应索引的任务
        this.tasks.splice(taskIndex, 1);
        console.log(`任务ID ${id} 删除成功`);
        return true; // 删除成功返回true
    }
    

    getById(id : number) : AbstractTask | undefined{
        //不需要返回报错因为找不到会返回 undefined
        return this.tasks.find(task => task.data.id === id);
    }


    getAll() : AbstractTask[]{
    // ... 是扩展运算符，作用是把 this.tasks 数组里的所有元素「展开」成独立的值
    // [] 是数组字面量，把展开后的所有值重新包裹成一个新的数组
    // 整体效果：创建一个和 this.tasks 内容完全相同，但内存地址不同的新数组
        return [...this.tasks];
    }

    //实现扩展方法
    //更新状态
    updateStatus(id: number, status: TaskStatus): boolean{
        const taskIndex = this.tasks.findIndex(task => task.data.id === id);
        if(taskIndex === -1) return false;
        this.tasks[taskIndex].data.status = status;
        return true;
    }

    //根据状态过滤
    filterByStatus(status: TaskStatus): AbstractTask[] {
        // let ansTasks : AbstractTask[];
        
        // return ansTasks;
        const filteredTasks = this.tasks.filter(task => {
            return task.data.status === status;
        });

        return [...filteredTasks];
    }

    filterByPriority(priority: Priority): AbstractTask[] {
        const fliterTasks = this.tasks.filter(task => {
            return task.data.priority === priority;
        });
        return [...fliterTasks];
    }

    // 新增：按关键词搜索任务（模糊匹配、忽略大小写）
    searchByKeyword(keyword: string): AbstractTask[] {
        // 1. 处理空关键词：返回空数组（避免匹配所有任务）
        if (!keyword || keyword.trim() === "") {
            return [];
        }

        // 2. 统一转小写，实现忽略大小写的搜索
        const lowerKeyword = keyword.trim().toLowerCase();

        // 3. 核心：筛选包含关键词的任务
        const matchedTasks = this.tasks.filter(task => {
            // 要匹配的字段：标题（必选） + 标签（可选）
            const title = task.data.title.toLowerCase(); // 标题转小写
            const tags = task.data.tags ? task.data.tags.toLowerCase() : ""; // 标签转小写（处理可选值）

            // 匹配规则：标题包含关键词 OR 标签包含关键词
            return title.includes(lowerKeyword) || tags.includes(lowerKeyword);
        });

        // 4. 返回副本，保护内部数据
        return [...matchedTasks];
    }
    
     // 新增：统计任务状态数据
    getStats(): { total: number; done: number; todo: number } {
        // 1. 初始化统计变量
        let doneCount = 0; // 已完成任务数
        let todoCount = 0;  // 待办任务数

        // 2. 遍历所有任务，按状态计数
        this.tasks.forEach(task => {
            switch (task.data.status) {
                case TaskStatus.DONE:
                    doneCount++;
                    break;
                case TaskStatus.TODO:
                    todoCount++;
                    break;
                // 进行中（IN_PROGRESS）不统计到todo/done，只算总数
                case TaskStatus.IN_PROGRESS:
                    break;
            }
        });

        // 3. 返回统计结果（总数=数组长度）
        return {
            total: this.tasks.length, // 总数直接取数组长度，无需额外遍历
            done: doneCount,
            todo: todoCount
        };
    }
}



// ===================== 函数重载核心实现 =====================
// 1. 定义重载签名（只声明，不实现）
function formatTask(data : AbstractTask) : string;
function formatTask(data : AbstractTask[]) : string[];

// 2. 实现通用函数体（必须兼容所有重载签名）
function formatTask(data: AbstractTask | AbstractTask[]): string | string[] {
    // 辅助函数：格式化单个任务为字符串
    const formatSingleTask = (task: AbstractTask): string => {
        // 状态文字映射（提升可读性）   省去if判断
        const statusMap = {
            [TaskStatus.TODO]: "待办",
            [TaskStatus.IN_PROGRESS]: "进行中",
            [TaskStatus.DONE]: "已完成"
        };
        // 拼接格式化字符串
        let taskStr = `【任务${task.data.id}】${task.data.title} | 状态：${statusMap[task.data.status]} | 优先级：${task.data.priority}`;
        if (task.data.tags) {
            taskStr += ` | 标签：${task.data.tags}`;
        }
        return taskStr;
    };

    // 判断参数类型，分支处理
    if (Array.isArray(data)) {
        // 传入的是数组 → 返回字符串数组
        return data.map(formatSingleTask);  //map() 是数组方法，
        // 作用是「遍历数组的每一个元素，对每个元素执行指定函数，返回新数组」
    } else {
        // 传入的是单个任务 → 返回字符串
        return formatSingleTask(data);
    }
}


// ===================== 打印函数核心实现 =====================
function printTasks(tasks: AbstractTask[], showIndex: boolean = true): void {
    // 1. 处理空数组场景
    if (tasks.length === 0) {
        console.log("📄 暂无任务可显示");
        return;
    }

    // 2. 状态文字映射（和之前formatTask保持一致）
    const statusMap = {
        [TaskStatus.TODO]: "待办",
        [TaskStatus.IN_PROGRESS]: "进行中",
        [TaskStatus.DONE]: "已完成"
    };

    // 3. 打印标题
    console.log("\n========== 任务列表 ==========");

    // 4. 遍历任务并打印
    tasks.forEach((task, index) => {
        // 4.1 构建序号前缀（根据showIndex决定是否显示）
        const indexPrefix = showIndex ? `[${index + 1}] ` : "";

        // 4.2 构建任务核心信息
        let taskInfo = `${indexPrefix}【ID: ${task.data.id}】${task.data.title}`;
        taskInfo += ` | 状态：${statusMap[task.data.status]}`;
        taskInfo += ` | 优先级：${task.data.priority}`;

        // 4.3 可选：添加标签（如果有）
        if (task.data.tags) {
            taskInfo += ` | 标签：${task.data.tags}`;
        }

        // 4.4 打印单条任务
        console.log(taskInfo);
    });

    // 5. 打印结束分隔符
    console.log("==============================\n");
}



//实现泛型函数
function pickField<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

function makePair<S, T>(first: S, second: T): [S, T] {
    return [first,second];
}


function identity<T>(value: T): T {
    return value;
}




// ===================== 完整测试函数 =====================
function test() {
    console.log("========== 开始测试学生任务管理器 ==========\n");

    // 1. 初始化任务管理器
    const taskManager = new TaskManager();
    console.log("✅ 步骤1：初始化任务管理器完成");

    // 2. 创建任务基础数据（使用createId生成唯一ID）
    const task1Base: ITaskBase = {
        id: taskManager['createId'](), // 注意：createId是private，测试用临时访问（实际开发可封装createTaskBase方法）
        title: "完成TypeScript作业",
        status: TaskStatus.TODO,
        priority: "middle",
        tags: "学习,TS,作业"
    };
    const task2Base: ITaskBase = {
        id: taskManager['createId'](),
        title: "复习数学公式",
        status: TaskStatus.IN_PROGRESS,
        priority: "high",
        tags: "学习,数学,考试"
    };
    const task3Base: ITaskBase = {
        id: taskManager['createId'](),
        title: "整理英语错题本",
        status: TaskStatus.DONE,
        priority: "low",
        tags: "学习,英语,错题"
    };
    const task4Base: ITaskBase = {
        id: taskManager['createId'](),
        title: "刷算法题",
        status: TaskStatus.TODO,
        priority: "high",
        tags: "编程,算法"
    };
    console.log("✅ 步骤2：创建4个任务基础数据完成");

    // 3. 创建子类任务实例（NormalTask + ExamTask）
    const normalTask1 = new NormalTask(task1Base, new Date(2026, 3, 30)); // 截止日期2026-04-30
    const examTask1 = new ExamTask(task2Base, "数学", 90); // 科目：数学，目标分数90
    const normalTask2 = new NormalTask(task3Base, new Date(2026, 4, 10)); // 截止日期2026-05-10
    const examTask2 = new ExamTask(task4Base, "编程", 85); // 科目：编程，目标分数85
    console.log("✅ 步骤3：创建子类任务实例完成");

    // 4. 添加任务到管理器
    console.log("\n========== 测试添加任务 ==========");
    taskManager.add(normalTask1);
    taskManager.add(examTask1);
    taskManager.add(normalTask2);
    taskManager.add(examTask2);
    // 测试重复添加（预期报错）
    taskManager.add(normalTask1);

    // 5. 测试获取所有任务 + 打印任务列表
    console.log("\n========== 测试获取所有任务并打印 ==========");
    const allTasks = taskManager.getAll();
    printTasks(allTasks); // 默认显示序号

    // 6. 测试按ID查询任务
    console.log("\n========== 测试按ID查询任务 ==========");
    const taskById = taskManager.getById(2);
    if (taskById) {
        console.log(`查询到ID=2的任务：${taskById.getSummary()}`);
        console.log(`格式化该任务：${formatTask(taskById)}`);
    }

    // 7. 测试按状态筛选
    console.log("\n========== 测试按状态筛选（待办任务） ==========");
    const todoTasks = taskManager.filterByStatus(TaskStatus.TODO);
    printTasks(todoTasks, false); // 不显示序号

    // 8. 测试按优先级筛选
    console.log("\n========== 测试按优先级筛选（high） ==========");
    const highPriorityTasks = taskManager.filterByPriority("high");
    printTasks(highPriorityTasks);

    // 9. 测试关键词搜索
    console.log("\n========== 测试关键词搜索（学习） ==========");
    const searchResult1 = taskManager.searchByKeyword("学习");
    printTasks(searchResult1);

    console.log("\n========== 测试关键词搜索（算法） ==========");
    const searchResult2 = taskManager.searchByKeyword("算法");
    printTasks(searchResult2);

    // 10. 测试更新任务状态
    console.log("\n========== 测试更新任务状态（ID=1改为已完成） ==========");
    const updateSuccess = taskManager.updateStatus(1, TaskStatus.DONE);
    console.log(`更新状态结果：${updateSuccess ? "成功" : "失败"}`);
    // 打印更新后的任务
    const updatedTask = taskManager.getById(1);
    if (updatedTask) {
        console.log(`更新后ID=1的任务状态：${TaskStatus[updatedTask.data.status]}`);
    }

    // 11. 测试任务统计
    console.log("\n========== 测试任务统计 ==========");
    const stats = taskManager.getStats();
    console.log(`总任务数：${stats.total}`);
    console.log(`已完成任务数：${stats.done}`);
    console.log(`待办任务数：${stats.todo}`);

    // 12. 测试删除任务
    console.log("\n========== 测试删除任务（ID=4） ==========");
    const deleteSuccess = taskManager.removeById(4);
    console.log(`删除结果：${deleteSuccess ? "成功" : "失败"}`);
    // 打印删除后的所有任务
    console.log("\n========== 删除后剩余任务 ==========");
    printTasks(taskManager.getAll());

    // 13. 测试泛型函数
    console.log("\n========== 测试泛型函数 ==========");
    // pickField：提取任务的title
    const task1Title = pickField(normalTask1.data, "title");
    console.log(`pickField提取ID=1的任务标题：${task1Title}`);

    // makePair：创建任务ID-标题元组
    const taskPair = makePair(normalTask1.data.id, normalTask1.data.title);
    console.log(`makePair创建元组：${taskPair}（类型：[number, string]）`);

    // identity：恒等函数
    const identityTest = identity("测试恒等函数");
    console.log(`identity函数返回值：${identityTest}`);

    // 14. 测试空列表打印
    console.log("\n========== 测试空列表打印 ==========");
    const emptyTasks: AbstractTask[] = [];
    printTasks(emptyTasks);

    console.log("\n========== 所有测试完成 ==========");
}

// 执行测试函数
test();