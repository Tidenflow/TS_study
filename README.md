# TS_study
Recording My TypeScript Learning Journey

根据README，你的TypeScript学习分为5个阶段：
1. 阶段一：基础类型 - 原始类型、数组与元组、枚举
2. 阶段二：接口与高级对象 - 接口vs类型、函数重载、抽象类
3. 阶段三：泛型魔法 - 泛型约束、泛型接口、keyof（核心）
4. 阶段四：类型体操 - 条件类型、映射类型、模板字符串类型
5. 阶段五：实战封装 - 封装axios、全局声明文件


# Expected code organization
```text
TS_study/
├── src/                        # 核心源码目录
│   ├── 01-Basic-Types/         # 阶段一：基础类型标配
│   │   ├── primitive.ts        # 原始类型 (string, number, boolean, symbol)
│   │   ├── array-tuple.ts      # 数组与元组 (Tuple) 的越界处理
│   │   └── enum-const.ts       # 枚举 vs 常量枚举的编译差异
│   ├── 02-Advanced-Interfaces/ # 阶段二：接口与高级对象
│   │   ├── interface-vs-type.ts# 接口与类型别名的深度对比
│   │   ├── function-overload.ts# 函数重载与可调用接口
│   │   └── class-implements.ts # 类实现接口与抽象类 (Abstract Class)
│   ├── 03-Generics-Mastery/    # 阶段三：泛型魔法 (核心)
│   │   ├── generic-constraints.ts # 泛型约束 (extends)
│   │   ├── generic-interface.ts   # 泛型接口与泛型类
│   │   └── keyof-operator.ts      # keyof 与索引类型访问
│   ├── 04-Type-Manipulation/   # 阶段四：类型体操 (进阶)
│   │   ├── conditional-types.ts   # 条件类型 (T extends U ? X : Y)
│   │   ├── mapped-types.ts        # 映射类型 (ReadOnly, Partial 手写版)
│   │   └── template-literals.ts   # 模板字符串类型 (TS 4.1+)
│   └── 05-Real-World/          # 阶段五：实战封装
│       ├── axios-wrapper.ts       # 封装带类型的请求响应
│       └── global-d-ts/           # 全局声明文件 (.d.ts) 的组织
├── tests/                      # 测试用例 (验证类型逻辑)
│   ├── basic.test.ts           # 基础练习的断言测试
│   └── generics.test.ts        # 验证泛型函数在不同输入下的表现
├── dist/                       # 编译后的产物 (JS 文件)
├── .gitignore                  # 忽略 node_modules 和 dist
├── package.json                # 项目依赖与脚本 (vitest, typescript)
├── tsconfig.json               # 严格模式配置 (Strict: true)
└── README.md                   # 学习路线与知识地图
