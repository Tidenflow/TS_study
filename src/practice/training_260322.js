// training_260322.ts
//实现学生任务管理器 StudentTaskManager
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
//   1.类型与枚举定义
//(1)状态枚举
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["TODO"] = 0] = "TODO";
    TaskStatus[TaskStatus["IN_PROGRESS"] = 1] = "IN_PROGRESS";
    TaskStatus[TaskStatus["DONE"] = 2] = "DONE";
})(TaskStatus || (TaskStatus = {}));
//  4.实现抽象类
var AbstractTask = /** @class */ (function () {
    function AbstractTask(data) {
        // this.id = id;
        // this.title = title;
        // this.status = status;
        // this.priority = priority;
        this.data = data;
    }
    AbstractTask.prototype.markDone = function () {
        var mark = "MarkDone Info:\nid = ".concat(this.data.id, "\ntitle =").concat(this.data.title, "\nstatus =").concat(this.data.status, "\npriority =").concat(this.data.priority, "\n");
        if (this.data.tags)
            mark += "tags =".concat(this.data.tags);
        console.log(mark);
    };
    return AbstractTask;
}());
//  5.实现子类一
var NormalTask = /** @class */ (function (_super) {
    __extends(NormalTask, _super);
    function NormalTask(data, deadline) {
        //此处怎么进行唤醒？？？  上面参数要加上  data : ITaskBase
        var _this = _super.call(this, data) || this;
        _this.deadline = deadline;
        return _this;
    }
    NormalTask.prototype.getSummary = function () {
        return "(\u5B50\u7C7BNormalTask)Task".concat(this.data.id, "\u91CD\u5199getSummary\u51FD\u6570");
    };
    return NormalTask;
}(AbstractTask));
//  6.实现子类二
var ExamTask = /** @class */ (function (_super) {
    __extends(ExamTask, _super);
    // 修正：构造函数需要接收 ITaskBase + 子类专属属性（刚才这里没写构造函数）
    function ExamTask(data, subject, score) {
        var _this = _super.call(this, data) || this;
        _this.subject = subject;
        _this.score = score;
        return _this;
    }
    ExamTask.prototype.getSummary = function () {
        return "(\u5B50\u7C7BExamTask)Task".concat(this.data.id, "\u91CD\u5199getSummary\u51FD\u6570");
    };
    return ExamTask;
}(AbstractTask));
//  7.核心管理类
var TaskManager = /** @class */ (function () {
    function TaskManager() {
        //注意这个tasks就是模拟任务列表的
        this.tasks = [];
    }
    //生成唯一的id
    TaskManager.prototype.createId = function () {
        //下面这个是错误写法，这样写第一个id是2
        // TaskManager.nextId++;
        // return TaskManager.nextId;
        var current_id = TaskManager.nextId;
        TaskManager.nextId++;
        return current_id;
    };
    //实现仓库接口的全部方法
    //(1)添加任务
    TaskManager.prototype.add = function (item) {
        //安全校验：避免重复添加任务、比面空任务
        if (!item || this.getById(item.data.id)) {
            console.warn("\u4EFB\u52A1ID ".concat(item.data.id, " \u5DF2\u5B58\u5728\uFF0C\u6DFB\u52A0\u5931\u8D25"));
            return;
        }
        this.tasks.push(item);
        console.log("\u4EFB\u52A1ID ".concat(item.data.id, " \u6DFB\u52A0\u6210\u529F"));
    };
    //根据id删除任务
    TaskManager.prototype.removeById = function (id) {
        //先找出任务索引（id）
        var taskIndex = this.tasks.findIndex(function (task) { return task.data.id === id; });
        //找不到匹配元素固定返回 -1
        if (taskIndex === -1) {
            console.warn("\u4EFB\u52A1ID ".concat(id, " \u4E0D\u5B58\u5728\uFF0C\u5220\u9664\u5931\u8D25"));
            return false; // 删除失败返回false
        }
        // 删除对应索引的任务
        this.tasks.splice(taskIndex, 1);
        console.log("\u4EFB\u52A1ID ".concat(id, " \u5220\u9664\u6210\u529F"));
        return true; // 删除成功返回true
    };
    TaskManager.prototype.getById = function (id) {
        //不需要返回报错因为找不到会返回 undefined
        return this.tasks.find(function (task) { return task.data.id === id; });
    };
    TaskManager.prototype.getAll = function () {
        // ... 是扩展运算符，作用是把 this.tasks 数组里的所有元素「展开」成独立的值
        // [] 是数组字面量，把展开后的所有值重新包裹成一个新的数组
        // 整体效果：创建一个和 this.tasks 内容完全相同，但内存地址不同的新数组
        return __spreadArray([], this.tasks, true);
    };
    //实现扩展方法
    //更新状态
    TaskManager.prototype.updateStatus = function (id, status) {
        var taskIndex = this.tasks.findIndex(function (task) { return task.data.id === id; });
        if (taskIndex === -1)
            return false;
        this.tasks[taskIndex].data.status = status;
        return true;
    };
    //根据状态过滤
    TaskManager.prototype.filterByStatus = function (status) {
        // let ansTasks : AbstractTask[];
        // return ansTasks;
        var filteredTasks = this.tasks.filter(function (task) {
            return task.data.status === status;
        });
        return __spreadArray([], filteredTasks, true);
    };
    TaskManager.prototype.filterByPriority = function (priority) {
        var fliterTasks = this.tasks.filter(function (task) {
            return task.data.priority === priority;
        });
        return __spreadArray([], fliterTasks, true);
    };
    // 新增：按关键词搜索任务（模糊匹配、忽略大小写）
    TaskManager.prototype.searchByKeyword = function (keyword) {
        // 1. 处理空关键词：返回空数组（避免匹配所有任务）
        if (!keyword || keyword.trim() === "") {
            return [];
        }
        // 2. 统一转小写，实现忽略大小写的搜索
        var lowerKeyword = keyword.trim().toLowerCase();
        // 3. 核心：筛选包含关键词的任务
        var matchedTasks = this.tasks.filter(function (task) {
            // 要匹配的字段：标题（必选） + 标签（可选）
            var title = task.data.title.toLowerCase(); // 标题转小写
            var tags = task.data.tags ? task.data.tags.toLowerCase() : ""; // 标签转小写（处理可选值）
            // 匹配规则：标题包含关键词 OR 标签包含关键词
            return title.includes(lowerKeyword) || tags.includes(lowerKeyword);
        });
        // 4. 返回副本，保护内部数据
        return __spreadArray([], matchedTasks, true);
    };
    // 新增：统计任务状态数据
    TaskManager.prototype.getStats = function () {
        // 1. 初始化统计变量
        var doneCount = 0; // 已完成任务数
        var todoCount = 0; // 待办任务数
        // 2. 遍历所有任务，按状态计数
        this.tasks.forEach(function (task) {
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
    };
    TaskManager.nextId = 1;
    return TaskManager;
}());
// 2. 实现通用函数体（必须兼容所有重载签名）
function formatTask(data) {
    // 辅助函数：格式化单个任务为字符串
    var formatSingleTask = function (task) {
        var _a;
        // 状态文字映射（提升可读性）   省去if判断
        var statusMap = (_a = {},
            _a[TaskStatus.TODO] = "待办",
            _a[TaskStatus.IN_PROGRESS] = "进行中",
            _a[TaskStatus.DONE] = "已完成",
            _a);
        // 拼接格式化字符串
        var taskStr = "\u3010\u4EFB\u52A1".concat(task.data.id, "\u3011").concat(task.data.title, " | \u72B6\u6001\uFF1A").concat(statusMap[task.data.status], " | \u4F18\u5148\u7EA7\uFF1A").concat(task.data.priority);
        if (task.data.tags) {
            taskStr += " | \u6807\u7B7E\uFF1A".concat(task.data.tags);
        }
        return taskStr;
    };
    // 判断参数类型，分支处理
    if (Array.isArray(data)) {
        // 传入的是数组 → 返回字符串数组
        return data.map(formatSingleTask); //map() 是数组方法，
        // 作用是「遍历数组的每一个元素，对每个元素执行指定函数，返回新数组」
    }
    else {
        // 传入的是单个任务 → 返回字符串
        return formatSingleTask(data);
    }
}
// ===================== 打印函数核心实现 =====================
function printTasks(tasks, showIndex) {
    var _a;
    if (showIndex === void 0) { showIndex = true; }
    // 1. 处理空数组场景
    if (tasks.length === 0) {
        console.log("📄 暂无任务可显示");
        return;
    }
    // 2. 状态文字映射（和之前formatTask保持一致）
    var statusMap = (_a = {},
        _a[TaskStatus.TODO] = "待办",
        _a[TaskStatus.IN_PROGRESS] = "进行中",
        _a[TaskStatus.DONE] = "已完成",
        _a);
    // 3. 打印标题
    console.log("\n========== 任务列表 ==========");
    // 4. 遍历任务并打印
    tasks.forEach(function (task, index) {
        // 4.1 构建序号前缀（根据showIndex决定是否显示）
        var indexPrefix = showIndex ? "[".concat(index + 1, "] ") : "";
        // 4.2 构建任务核心信息
        var taskInfo = "".concat(indexPrefix, "\u3010ID: ").concat(task.data.id, "\u3011").concat(task.data.title);
        taskInfo += " | \u72B6\u6001\uFF1A".concat(statusMap[task.data.status]);
        taskInfo += " | \u4F18\u5148\u7EA7\uFF1A".concat(task.data.priority);
        // 4.3 可选：添加标签（如果有）
        if (task.data.tags) {
            taskInfo += " | \u6807\u7B7E\uFF1A".concat(task.data.tags);
        }
        // 4.4 打印单条任务
        console.log(taskInfo);
    });
    // 5. 打印结束分隔符
    console.log("==============================\n");
}
//实现泛型函数
function pickField(obj, key) {
    return obj[key];
}
function makePair(first, second) {
    return [first, second];
}
function identity(value) {
    return value;
}
// ===================== 完整测试函数 =====================
function test() {
    console.log("========== 开始测试学生任务管理器 ==========\n");
    // 1. 初始化任务管理器
    var taskManager = new TaskManager();
    console.log("✅ 步骤1：初始化任务管理器完成");
    // 2. 创建任务基础数据（使用createId生成唯一ID）
    var task1Base = {
        id: taskManager['createId'](), // 注意：createId是private，测试用临时访问（实际开发可封装createTaskBase方法）
        title: "完成TypeScript作业",
        status: TaskStatus.TODO,
        priority: "middle",
        tags: "学习,TS,作业"
    };
    var task2Base = {
        id: taskManager['createId'](),
        title: "复习数学公式",
        status: TaskStatus.IN_PROGRESS,
        priority: "high",
        tags: "学习,数学,考试"
    };
    var task3Base = {
        id: taskManager['createId'](),
        title: "整理英语错题本",
        status: TaskStatus.DONE,
        priority: "low",
        tags: "学习,英语,错题"
    };
    var task4Base = {
        id: taskManager['createId'](),
        title: "刷算法题",
        status: TaskStatus.TODO,
        priority: "high",
        tags: "编程,算法"
    };
    console.log("✅ 步骤2：创建4个任务基础数据完成");
    // 3. 创建子类任务实例（NormalTask + ExamTask）
    var normalTask1 = new NormalTask(task1Base, new Date(2026, 3, 30)); // 截止日期2026-04-30
    var examTask1 = new ExamTask(task2Base, "数学", 90); // 科目：数学，目标分数90
    var normalTask2 = new NormalTask(task3Base, new Date(2026, 4, 10)); // 截止日期2026-05-10
    var examTask2 = new ExamTask(task4Base, "编程", 85); // 科目：编程，目标分数85
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
    var allTasks = taskManager.getAll();
    printTasks(allTasks); // 默认显示序号
    // 6. 测试按ID查询任务
    console.log("\n========== 测试按ID查询任务 ==========");
    var taskById = taskManager.getById(2);
    if (taskById) {
        console.log("\u67E5\u8BE2\u5230ID=2\u7684\u4EFB\u52A1\uFF1A".concat(taskById.getSummary()));
        console.log("\u683C\u5F0F\u5316\u8BE5\u4EFB\u52A1\uFF1A".concat(formatTask(taskById)));
    }
    // 7. 测试按状态筛选
    console.log("\n========== 测试按状态筛选（待办任务） ==========");
    var todoTasks = taskManager.filterByStatus(TaskStatus.TODO);
    printTasks(todoTasks, false); // 不显示序号
    // 8. 测试按优先级筛选
    console.log("\n========== 测试按优先级筛选（high） ==========");
    var highPriorityTasks = taskManager.filterByPriority("high");
    printTasks(highPriorityTasks);
    // 9. 测试关键词搜索
    console.log("\n========== 测试关键词搜索（学习） ==========");
    var searchResult1 = taskManager.searchByKeyword("学习");
    printTasks(searchResult1);
    console.log("\n========== 测试关键词搜索（算法） ==========");
    var searchResult2 = taskManager.searchByKeyword("算法");
    printTasks(searchResult2);
    // 10. 测试更新任务状态
    console.log("\n========== 测试更新任务状态（ID=1改为已完成） ==========");
    var updateSuccess = taskManager.updateStatus(1, TaskStatus.DONE);
    console.log("\u66F4\u65B0\u72B6\u6001\u7ED3\u679C\uFF1A".concat(updateSuccess ? "成功" : "失败"));
    // 打印更新后的任务
    var updatedTask = taskManager.getById(1);
    if (updatedTask) {
        console.log("\u66F4\u65B0\u540EID=1\u7684\u4EFB\u52A1\u72B6\u6001\uFF1A".concat(TaskStatus[updatedTask.data.status]));
    }
    // 11. 测试任务统计
    console.log("\n========== 测试任务统计 ==========");
    var stats = taskManager.getStats();
    console.log("\u603B\u4EFB\u52A1\u6570\uFF1A".concat(stats.total));
    console.log("\u5DF2\u5B8C\u6210\u4EFB\u52A1\u6570\uFF1A".concat(stats.done));
    console.log("\u5F85\u529E\u4EFB\u52A1\u6570\uFF1A".concat(stats.todo));
    // 12. 测试删除任务
    console.log("\n========== 测试删除任务（ID=4） ==========");
    var deleteSuccess = taskManager.removeById(4);
    console.log("\u5220\u9664\u7ED3\u679C\uFF1A".concat(deleteSuccess ? "成功" : "失败"));
    // 打印删除后的所有任务
    console.log("\n========== 删除后剩余任务 ==========");
    printTasks(taskManager.getAll());
    // 13. 测试泛型函数
    console.log("\n========== 测试泛型函数 ==========");
    // pickField：提取任务的title
    var task1Title = pickField(normalTask1.data, "title");
    console.log("pickField\u63D0\u53D6ID=1\u7684\u4EFB\u52A1\u6807\u9898\uFF1A".concat(task1Title));
    // makePair：创建任务ID-标题元组
    var taskPair = makePair(normalTask1.data.id, normalTask1.data.title);
    console.log("makePair\u521B\u5EFA\u5143\u7EC4\uFF1A".concat(taskPair, "\uFF08\u7C7B\u578B\uFF1A[number, string]\uFF09"));
    // identity：恒等函数
    var identityTest = identity("测试恒等函数");
    console.log("identity\u51FD\u6570\u8FD4\u56DE\u503C\uFF1A".concat(identityTest));
    // 14. 测试空列表打印
    console.log("\n========== 测试空列表打印 ==========");
    var emptyTasks = [];
    printTasks(emptyTasks);
    console.log("\n========== 所有测试完成 ==========");
}
// 执行测试函数
test();
