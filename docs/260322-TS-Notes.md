# TypeScript 学生任务管理器学习笔记

> 2026-03-22 学习内容总结（基于 `src/practice/training_260322.ts`）

---

## 目录

1. [整体设计与建模思路](#1-整体设计与建模思路)
2. [类型系统部分：枚举、字面量联合与基础接口](#2-类型系统部分枚举字面量联合与基础接口)
3. [面向对象部分：抽象类、子类与多态](#3-面向对象部分抽象类子类与多态)
4. [任务管理核心类 TaskManager（仓库模式）](#4-任务管理核心类-taskmanager仓库模式)
5. [函数能力：重载、列表打印与泛型函数](#5-函数能力重载列表打印与泛型函数)
6. [测试流程复盘：从初始化到统计删除](#6-测试流程复盘从初始化到统计删除)
7. [重点问题解析：为什么这几个接口没有完全用起来？](#7-重点问题解析为什么这几个接口没有完全用起来)
8. [今日收获与下一步优化建议](#8-今日收获与下一步优化建议)

---

## 1. 整体设计与建模思路

本次练习实现了一个“学生任务管理器”，代码结构非常完整，已经具备小型业务系统的雏形：

- 用 `TaskStatus` + `Priority` 约束任务核心状态
- 用 `ITaskBase` 把任务公共字段抽象成统一数据结构
- 用抽象类 `AbstractTask` 定义任务共同行为
- 用 `NormalTask` / `ExamTask` 表达不同任务类型
- 用 `TaskManager` 集中管理任务（增删查改 + 筛选 + 搜索 + 统计）
- 用函数重载和泛型函数增强类型安全与复用性

核心价值是：本次练习已经不只是“写一个对象数组”，而是在用 TypeScript 做领域建模。

---

## 2. 类型系统部分：枚举、字面量联合与基础接口

### 2.1 状态枚举 `TaskStatus`

```ts
enum TaskStatus {
    TODO,
    IN_PROGRESS,
    DONE
}
```

作用：

- 将任务状态限定在有限集合中，避免随手写字符串带来的拼写错误
- 便于 `switch`/映射对象做状态分支

### 2.2 优先级联合类型 `Priority`

```ts
type Priority = "low" | "middle" | "high";
```

作用：

- 比 `string` 更严格，只允许这三个值
- 直接提升 `filterByPriority`、创建任务数据时的安全性

### 2.3 任务基础接口 `ITaskBase`

```ts
interface ITaskBase {
    readonly id: number;
    title: string;
    status: TaskStatus;
    priority: Priority;
    tags?: string;
}
```

这个接口定义了“任何任务都必须具备”的公共数据契约：

- `readonly id`：任务标识不可随意修改
- `title/status/priority`：核心业务字段
- `tags?`：可选补充信息

后续所有任务类型都围绕这个接口展开，建模方向清晰。

---

## 3. 面向对象部分：抽象类、子类与多态

### 3.1 抽象类 `AbstractTask`

```ts
abstract class AbstractTask {
    public data: ITaskBase;
    constructor(data: ITaskBase) {
        this.data = data;
    }

    abstract getSummary(): string;

    markDone(): void {
        // 输出任务信息
    }
}
```

关键点：

- `AbstractTask` 不直接实例化，负责统一“任务共有能力”
- `abstract getSummary()` 强制子类实现自己的摘要逻辑
- `markDone()` 放在父类实现，体现“共同行为复用”

### 3.2 子类 `NormalTask`

- 增加字段：`deadline?: Date`
- 实现 `getSummary()`
- 构造函数先 `super(data)` 再处理子类字段

### 3.3 子类 `ExamTask`

- 增加字段：`subject: string`、`score: number`
- 实现 `getSummary()`
- 同样遵循“先 `super`，后子类初始化”

### 3.4 多态效果

`TaskManager` 统一存储 `AbstractTask[]`，但数组里可以放 `NormalTask` 和 `ExamTask`。这就是非常标准的多态使用场景：

- 统一管理（父类型）
- 差异扩展（子类型）

---

## 4. 任务管理核心类 TaskManager（仓库模式）

`TaskManager implements IRepository<AbstractTask>` 是本次练习最关键的工程化部分。

### 4.1 内部状态与 ID 生成

- `private tasks: AbstractTask[] = []`
- `private static nextId = 1`
- `private createId()` 负责生成唯一 ID

在注释里已经识别并修正了“先 `++` 会导致首个 ID 变成 2”的问题，这个细节很关键。

### 4.2 仓库接口实现（基础 CRUD）

1. `add(item)`：
- 防空、防重复 ID
- 成功 push，失败告警

2. `removeById(id)`：
- 先找索引，再 `splice`
- 返回 `boolean` 明确表示删除结果

3. `getById(id)`：
- 找不到返回 `undefined`

4. `getAll()`：
- 返回副本 `[...]`，避免外部直接改内部数组

这一组方法已经体现了“封装内部状态 + 暴露受控操作”的意识。

### 4.3 扩展业务方法

1. `updateStatus(id, status)`：按 ID 更新状态
2. `filterByStatus(status)`：按状态筛选
3. `filterByPriority(priority)`：按优先级筛选
4. `searchByKeyword(keyword)`：
- 支持标题/标签字段
- 忽略大小写
- 空关键词直接返回空数组
5. `getStats()`：
- 统计 `total/done/todo`
- `IN_PROGRESS` 仅计入总数

这说明代码已经在从“数据操作”过渡到“业务语义方法”。

---

## 5. 函数能力：重载、列表打印与泛型函数

### 5.1 `formatTask` 函数重载

```ts
function formatTask(data: AbstractTask): string;
function formatTask(data: AbstractTask[]): string[];
```

实现里通过 `Array.isArray(data)` 分支处理：

- 单个任务 -> `string`
- 任务数组 -> `string[]`

这是典型的“同名函数，按输入返回不同类型”，练习非常到位。

### 5.2 `printTasks` 打印函数

设计亮点：

- 支持空数组提示
- 支持 `showIndex` 控制是否显示序号
- 状态映射统一可读文本
- 按字段逐步拼接输出，结构清晰

### 5.3 泛型函数

1. `pickField<T, K extends keyof T>(obj, key): T[K]`
- 安全提取对象字段
- 防止传不存在的 key

2. `makePair<S, T>(first, second): [S, T]`
- 返回类型精确的二元组

3. `identity<T>(value): T`
- 最基础泛型恒等函数

这三者组合体现了对“泛型约束 + 泛型推断 + 多类型参数”的掌握。

---

## 6. 测试流程复盘：从初始化到统计删除

`test()` 做了完整流程验证：

1. 初始化管理器
2. 创建 `ITaskBase` 数据
3. 构建两个子类任务
4. 测试添加与重复添加
5. 获取并打印全部任务
6. 按 ID 查询并格式化
7. 状态筛选
8. 优先级筛选
9. 关键词搜索
10. 更新状态
11. 统计任务数据
12. 删除任务
13. 验证泛型函数
14. 验证空列表打印

这已经不是“只测 happy path”，而是包含了重复添加、空输入等边界意识。

---

## 7. 重点问题解析：为什么这几个接口没有完全用起来？

本次重点对比的三个接口是：

```ts
interface IDescribe {
    getSummary(this: IDescribe): string;
}

interface IDictionary {
    [key: string]: string | number;
}

interface IRepository<T> {
    add(item: T): void;
    removeById(id: number): boolean;
    getById(id: number): T | undefined;
    getAll(): T[];
}
```

### 7.1 结论先说

- `IRepository<T>`：实际上已经正确使用（`TaskManager implements IRepository<AbstractTask>`）。
- `IDescribe`：当前被抽象类 `AbstractTask` 的 `abstract getSummary()` 覆盖了同类职责，所以没有额外实现该接口。
- `IDictionary`：当前业务里没有“动态键值字典”这个需求，所以暂时用不上。

因此并不是“漏了必须实现的内容”，而是“当前设计里有两个接口属于可扩展预留，但业务暂未触发”。

### 7.2 `IDescribe` 应该用在哪里？

适用场景：

- 需要“任何可描述对象”都能 `getSummary()`，且不要求它继承同一个抽象类

示例（适合跨层复用）：

```ts
class StudyPlan implements IDescribe {
    constructor(public topic: string) {}
    getSummary(this: IDescribe): string {
        return `学习计划：${(this as StudyPlan).topic}`;
    }
}
```

如果只有任务体系内部需要摘要，用抽象类已经足够；如果未来出现“非任务对象也要统一摘要输出”，`IDescribe` 就更合适。

### 7.3 `IDictionary` 应该用在哪里？

适用场景：

- 标签统计：`{ "学习": 3, "算法": 2 }`
- 状态文字映射：`{ "0": "待办", "1": "进行中" }`
- 任意动态配置表

例如：

```ts
const tagCounter: IDictionary = {
    学习: 3,
    算法: 2,
    owner: "student-A"
};
```

目前代码里状态映射直接写在函数中的对象字面量里，暂时不需要单独定义为接口。

### 7.4 `IRepository<T>` 的价值是什么？

当前已经在使用它，价值主要是：

- 统一仓库能力规范（增删查全量）
- 更换存储对象类型时复用接口
- 方便后续扩展出 `UserManager implements IRepository<User>` 这类结构

这也是本次代码里“最工程化”的接口使用。

### 7.5 是否“没考虑到问题”？ 

并不是没考虑到，而是做了一个合理取舍：

- 当前业务核心是“任务对象体系”，因此用抽象类收敛共性最直接
- 额外接口（`IDescribe`/`IDictionary`）属于“未来跨模块复用”才更有价值
- 保留了接口定义，说明已经有架构意识，只是还没到强依赖阶段

---

## 8. 今日收获与下一步优化建议

### 8.1 今日核心收获

| 维度 | 收获 |
|------|------|
| 建模 | 用接口 + 抽象类 + 子类把任务系统分层建模 |
| 类型安全 | 枚举、联合类型、泛型约束显著减少非法输入 |
| 工程能力 | `TaskManager` 具备仓库模式的基本结构 |
| 复用能力 | 重载与泛型函数提升了函数层的复用和可读性 |
| 测试意识 | 流程测试覆盖了主流程和部分边界场景 |

### 8.2 下一步可做优化

1. 给 `TaskManager` 提供公开的 `createTaskBase(...)`，避免测试中通过 `taskManager['createId']()` 访问 `private`。
2. `markDone()` 可以真正更新状态为 `DONE`，并将打印与状态修改职责拆开。
3. 将 `tags` 从 `string` 升级为 `string[]`，搜索与统计会更自然。
4. 把状态映射对象抽出成常量（或配合 `IDictionary` 统一管理）。
5. 为 `getStats()` 增加 `inProgress`，形成完整状态统计。

### 8.3 一句话总结

这次练习已经达到“可运行 + 有结构 + 有扩展性”的水平；下一步重点是继续把“可用代码”进化为“更可维护、可复用的领域模型”。

---
