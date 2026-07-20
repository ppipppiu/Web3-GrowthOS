## 1. 项目名称

### Week 2 技术 Demo

**Monad Check-in DApp**

中文名称：

**Monad 链上每日签到 DApp**

### Week 3—4 Prototype / Hackathon 项目

**Monad Builder Proof**

中文名称：

**Monad 链上贡献证明与 Builder 声誉平台**

项目名称后续可以根据团队讨论继续调整。

---

## 2. 项目整体定位

本项目分为两个阶段。

### 第一阶段：签到 DApp 技术训练

Week 2 先完成一个部署在 Monad Testnet 上的每日签到 DApp。

用户通过网页连接 MetaMask 钱包，完成每日链上签到，并查询累计签到次数和连续签到状态。

该阶段的重点不是产品创新，而是跑通 Web3 DApp 的基础技术闭环：

```text
React 前端
→ MetaMask 钱包
→ Solidity 智能合约
→ Monad Testnet
→ 交易确认
→ 链上数据读取
````

### 第二阶段：链上贡献证明平台

Week 3—4 在签到 Demo 的技术基础上，升级为一个面向 Web3 社区、开源项目、共学活动和 Hackathon 团队的链上贡献证明平台。

Builder 可以：

- 连接钱包；
- 查看项目任务；
- 领取任务；
- 提交贡献证明；
- 接受项目方审核；
- 获得链上贡献记录；
- 形成可验证的个人 Builder Profile；
- 展示技能、积分、项目经历和贡献历史。

项目希望解决：

> Web3 Builder 的代码、研究、运营、测试和内容贡献分散在 GitHub、文档、区块浏览器和社区平台中，难以形成统一、可信、可验证的贡献档案。

---

## 3. 项目阶段关系

```
Week 1
Onchain Todo
学习最小 Solidity 合约、部署和链上交互

        ↓

Week 2
Monad Check-in DApp
学习 React、MetaMask 和前端合约交互

        ↓

Week 3
Monad Builder Proof Prototype
完成任务、贡献提交、审核和贡献证明闭环

        ↓

Week 4
Hackathon Product
完善产品、部署、演示、Pitch 和数据看板
```

三个阶段不是三个完全独立的项目，而是逐步升级。

---

## 4. 职业方向

Week 2 主方向：

**Dev Builder**

具体定位：

> Web3 应用开发，偏 Java 后端、链上数据和全栈应用方向。

长期职业能力组合：

```
Java / Spring Boot
+ SQL / MySQL
+ 数据分析
+ React 基础
+ Solidity
+ MetaMask
+ EVM / Monad
+ 链上数据同步
```

该项目既可以体现 Web3 应用开发能力，也可以体现 Web2 后端、数据库和数据分析能力。

---

# 第一部分：Week 2 技术 Demo

## 5. Week 2 Demo 名称

**Monad Check-in DApp**

---

## 6. Week 2 Demo 目标

Week 2 的目标是完成一个可运行、可验证的最小 DApp。

核心目标：

> 用户无需操作 Remix，可以直接通过网页连接钱包，并在 Monad Testnet 上完成一次签到交易。

---

## 7. Week 2 Demo 目标用户

- Web3 新手；
- Monad Testnet 学习者；
- 需要练习钱包交互的 Builder；
- 希望体验智能合约调用的用户。

---

## 8. Week 2 最小可交付成果

至少完成：

- React 前端页面；
- MetaMask 钱包连接；
- 显示当前钱包地址；
- 检查 Monad Testnet；
- 调用签到智能合约；
- 完成一次链上签到；
- 防止同一钱包当天重复签到；
- 查询用户签到状态；
- 查询累计签到次数；
- 查询连续签到天数；
- 显示交易处理中状态；
- 显示签到成功或失败；
- 保存交易 Hash；
- 提供区块浏览器查询入口；
- 完善 GitHub README；
- 保存截图和开发日志。

---

## 9. Week 2 核心功能

### 9.1 钱包连接

- [ ]  检测浏览器是否安装 MetaMask
- [ ]  请求连接钱包
- [ ]  显示当前钱包地址
- [ ]  监听账户切换
- [ ]  监听网络切换

### 9.2 网络检查

- [ ]  检查是否连接 Monad Testnet
- [ ]  错误网络时显示提示
- [ ]  请求切换网络
- [ ]  必要时提示添加 Monad Testnet

### 9.3 每日签到

- [ ]  点击签到按钮
- [ ]  调用 `checkIn()`
- [ ]  MetaMask 弹出确认
- [ ]  显示等待钱包确认
- [ ]  显示交易处理中
- [ ]  等待交易上链
- [ ]  显示签到结果
- [ ]  展示交易 Hash

### 9.4 签到信息查询

- [ ]  查询今天是否签到
- [ ]  查询累计签到次数
- [ ]  查询连续签到天数
- [ ]  查询最近签到日期
- [ ]  在页面展示结果

### 9.5 用户体验

- [ ]  未连接钱包时禁用签到按钮
- [ ]  网络错误时禁用签到按钮
- [ ]  交易处理中防止重复点击
- [ ]  已签到时显示提示
- [ ]  交易失败时显示可理解的错误

---

## 10. Week 2 技术栈

- React
- JavaScript
- MetaMask
- ethers.js 或 viem
- Solidity
- Monad Testnet
- Git
- GitHub

---

## 11. Week 2 系统结构

```
用户
  ↓
React 前端
  ↓
MetaMask
  ↓
ethers.js / viem
  ↓
Monad Testnet
  ↓
CheckIn 智能合约
```

---

## 12. CheckIn 合约能力

合约需要支持：

- 每个钱包每天只能签到一次；
- 记录累计签到次数；
- 记录连续签到天数；
- 记录最近签到日期；
- 查询用户签到信息；
- 签到成功时触发事件。

可能使用的数据结构：

```
struct CheckInInfo {
    uint256 totalCheckIns;
    uint256 currentStreak;
    uint256 lastCheckInDay;
}
```

可能使用的函数：

```
function checkIn() external;
function hasCheckedInToday(address user) external view returns (bool);
function getCheckInInfo(address user) external view returns (...);
```

可能使用的事件：

```
event CheckedIn(
    address indexed user,
    uint256 checkInDay,
    uint256 totalCheckIns,
    uint256 currentStreak
);
```

---

# 第二部分：Week 3 Prototype

## 13. Prototype 名称

**Monad Builder Proof**

中文名称：

**Monad 链上贡献证明与 Builder 声誉平台**

---

## 14. 要解决的问题

Web3 Builder 的贡献通常分散在多个平台中：

- GitHub 中有代码和 Pull Request；
- Notion 或 Google Docs 中有研究报告；
- 区块浏览器中有部署和交易记录；
- X 或社区平台中有内容和运营贡献；
- Demo 平台中有产品成果。

这些贡献缺少统一的组织、审核和验证方式。

招聘者、项目方或队友很难快速判断：

- 某个 Builder 真正做过什么；
- 贡献属于哪个项目；
- 是否经过项目方确认；
- 具备哪些技能；
- 是否持续参与真实项目；
- 是否适合加入团队。

本项目希望建立：

> 一个基于钱包身份、项目任务、贡献提交和链上审核记录的 Builder 贡献档案系统。

---

## 15. 目标用户

### Builder

- Web3 开发者；
- Researcher；
- 社区运营人员；
- 测试人员；
- 内容创作者；
- Hackathon 参与者；
- Web3 求职者。

### 项目方

- Web3 初创团队；
- DAO；
- 开源项目；
- 共学社区；
- Hackathon 团队；
- Monad 生态项目。

### 查看者

- 招聘者；
- 项目负责人；
- Hackathon 队友；
- 社区管理者；
- 生态合作方。

---

## 16. Prototype 核心用户流程

```
项目方创建任务
        ↓
Builder 连接钱包
        ↓
Builder 领取任务
        ↓
Builder 完成任务
        ↓
提交贡献证明
        ↓
项目方审核
        ↓
审核通过
        ↓
贡献记录写入 Monad
        ↓
Builder Profile 更新
```

---

## 17. Prototype 核心功能

### 17.1 钱包身份

- [ ]  使用 MetaMask 连接钱包
- [ ]  钱包地址作为 Builder 身份
- [ ]  显示钱包地址和网络
- [ ]  区分 Builder 和项目审核者

### 17.2 项目管理

- [ ]  创建项目
- [ ]  填写项目名称和简介
- [ ]  设置项目负责人钱包
- [ ]  查看项目详情

Prototype 第一版可以只支持一个测试项目。

### 17.3 任务发布

项目方可以创建任务：

- 任务名称；
- 任务类型；
- 技能标签；
- 任务描述；
- 截止日期；
- 贡献积分；
- 提交要求。

任务类型可以包括：

```
Dev
Research
Ops
Design
Testing
Content
```

### 17.4 任务领取

Builder 可以：

- 查看任务；
- 连接钱包；
- 领取任务；
- 查看自己的任务状态。

### 17.5 贡献证明提交

Builder 可以提交：

- GitHub PR 链接；
- GitHub Commit 链接；
- 研究文档链接；
- Demo 链接；
- 合约地址；
- Transaction Hash；
- 部署链接；
- 文字说明。

完整内容不全部上链。

链上只保存必要的信息，例如：

- Builder 钱包；
- 项目 ID；
- 任务 ID；
- 贡献类型；
- 证明摘要 Hash；
- 审核结果；
- 积分；
- 时间。

### 17.6 贡献审核

项目负责人可以：

- 查看提交内容；
- 批准贡献；
- 拒绝贡献；
- 添加审核说明；
- 确认贡献积分。

只有指定审核者可以批准贡献。

### 17.7 链上贡献证明

审核通过后，智能合约记录：

```
贡献者钱包
项目 ID
任务 ID
贡献类型
证明摘要
审核者钱包
积分
完成时间
```

并触发贡献事件。

### 17.8 Builder Profile

个人页面显示：

- 钱包地址；
- 完成项目数；
- 完成任务数；
- 累计贡献积分；
- Dev 贡献数量；
- Research 贡献数量；
- Ops 贡献数量；
- 技能标签；
- 已验证贡献列表；
- 对应 Explorer 链接。

### 17.9 Participation 模块

Week 2 的签到功能可以保留为辅助模块：

- Workshop 签到；
- 共学活动签到；
- 团队会议参与；
- 项目冲刺签到；
- Hackathon 活动参与。

签到证明“参与过”，贡献证明“完成了什么”。

---

## 18. Prototype 最小可交付版本

Week 3 不需要一次实现所有功能。

最低完成一条核心闭环：

```
创建测试任务
→ Builder 领取
→ 提交贡献链接
→ 项目方审核
→ 贡献结果上链
→ Profile 展示
```

最低页面：

- 首页；
- 任务列表页；
- 任务详情页；
- 提交贡献页；
- 审核页；
- Builder Profile 页。

页面可以是简化版，不要求复杂视觉设计。

---

# 第三部分：Week 4 Hackathon 产品

## 19. Week 4 目标

Week 4 将 Prototype 打磨为：

> 一个可运行、可展示、可验证、可传播、可提交的 Monad 链上产品。

---

## 20. Week 4 必须交付

- 可访问的前端链接或可运行 Repo；
- Solidity 合约源码；
- Monad 合约地址；
- 部署 Transaction Hash；
- 至少一笔贡献审核交易 Hash；
- 区块浏览器链接；
- README；
- 项目架构说明；
- Demo 流程；
- 2—5 分钟 Demo Video；
- Pitch Deck；
- Final Presentation；
- 团队分工说明；
- AI Collaboration Log；
- Build Log。

---

## 21. Week 4 优先优化内容

### 产品完整度

- 完整任务流程；
- 两种用户角色；
- 清晰错误提示；
- 数据刷新；
- 空状态；
- 交易状态；
- Explorer 跳转。

### Monad Native 程度

强调：

- 高频任务与贡献提交；
- 高频审核与状态更新；
- 低延迟交易反馈；
- EVM 工具兼容；
- 可验证的链上贡献记录；
- 多项目协作扩展能力。

### 演示完整度

演示时至少完成：

```
项目方创建任务
→ Builder 领取
→ Builder 提交证明
→ 项目方审核
→ 链上交易成功
→ Builder Profile 更新
```

---

# 第四部分：技术架构

## 22. 完整技术栈

### 前端

- React
- JavaScript 或 TypeScript
- ethers.js 或 viem
- MetaMask

### 智能合约

- Solidity
- Monad Testnet
- Remix / Hardhat
- OpenZeppelin（按需）

### 后端

- Java
- Spring Boot
- Web3j
- REST API

### 数据库

- MySQL
- Redis（后续可选）

### 数据展示

- React 图表组件
- ECharts 或其他图表库
- 链上数据看板

### 项目管理

- Git
- GitHub
- Markdown
- AI Collaboration Log
- Build Log

---

## 23. 完整系统结构
```text
                         ┌──────────────┐
                         │    用户       │
                         └──────┬───────┘
                                ↓
                         ┌──────────────┐
                         │ React 前端    │
                         └───┬──────┬───┘
                             │      │
                     钱包交互 │      │ REST API
                             ↓      ↓
                      ┌─────────┐  ┌──────────────┐
                      │MetaMask │  │ Spring Boot  │
                      └────┬────┘  └──────┬───────┘
                           ↓              ↓
                    ┌────────────┐   ┌──────────┐
                    │ Monad 合约  │   │ MySQL    │
                    └─────┬──────┘   └──────────┘
                          │
                          └──事件同步──→ Spring Boot
```
## 24. 链上与链下职责划分

### 链上负责

- 钱包身份；
- 项目和任务标识；
- 贡献审核结果；
- 贡献证明摘要；
- 审核者地址；
- 贡献积分；
- 贡献时间；
- 关键事件。

### Spring Boot 负责

- 项目和任务详细信息；
- GitHub 或文档链接管理；
- 提交内容；
- 复杂权限；
- 链上事件同步；
- 数据统计；
- 排行榜；
- Profile 数据接口。

### MySQL 负责

- 项目详情；
- 任务详情；
- 用户资料；
- 技能标签；
- 提交记录；
- 审核说明；
- 链上索引数据；
- 统计结果。

---

# 第五部分：数据看板

## 25. 数据看板定位

数据看板不只是装饰，而是用于展示项目活跃度、Builder 贡献情况和协作效率。

---

## 26. 可展示指标

### 平台指标

- 活跃 Builder 数；
- 项目数量；
- 任务数量；
- 已完成任务数量；
- 审核通过率；
- 总贡献次数。

### 项目指标

- 项目参与人数；
- 任务完成率；
- 平均完成时间；
- 各类型贡献分布；
- 活跃趋势；
- 项目贡献排行榜。

### Builder 指标

- 累计贡献次数；
- 累计贡献积分；
- 项目参与数；
- Dev / Research / Ops 分布；
- 连续参与时间；
- 技能标签分布。

---

# 第六部分：团队分工

## 27. 建议角色

### Dev 合约

负责：

- 合约设计；
- 权限控制；
- 贡献审核逻辑；
- 事件设计；
- 合约测试和部署。

### Dev 前端

负责：

- React 页面；
- 钱包连接；
- 合约调用；
- 交易状态；
- Profile 展示。

### Java 后端

负责：

- Spring Boot；
- REST API；
- Web3j；
- 链上事件同步；
- MySQL；
- 统计接口。

### Research

负责：

- 用户问题研究；
- 竞品分析；
- Web3 链上声誉研究；
- Monad 使用理由；
- 产品需求说明。

### Ops

负责：

- 任务和积分规则；
- 用户引导；
- 社区活动设计；
- 测试用户招募；
- 传播和反馈收集。

### Data

负责：

- 指标体系；
- 数据模型；
- 看板；
- 用户行为分析；
- 项目活跃度分析。

---

## 28. 我的个人角色

我的主要定位：

> Web3 应用开发，偏 Java 后端、链上数据与数据分析。

我可以重点负责：

- 理解和测试 Solidity 合约；
- Spring Boot 后端；
- Web3j 链上连接；
- MySQL 数据设计；
- 链上事件同步；
- 数据指标设计；
- 数据看板；
- README 和项目文档。

前端目标：

> 能看懂、能修改、能完成基础交互，不要求成为纯前端开发者。

---

# 第七部分：当前已有基础

## 29. 已完成内容

- [x]  创建课程专用钱包
- [x]  配置 Monad Testnet
- [x]  获取测试币
- [x]  完成测试网交易
- [x]  学习 Solidity 基础
- [x]  完成 Onchain Todo 合约
- [x]  使用 Remix 编译和部署
- [x]  调用 Read Function
- [x]  调用 Write Function
- [x]  保存合约地址
- [x]  保存 Transaction Hash
- [x]  建立 GitHub 仓库
- [x]  确定 Dev Builder 方向
- [x]  建立 Week 2 项目计划
- [x]  建立 AI Collaboration Log
- [x]  建立 Build Log

---

## 30. 当前正在进行

- [ ]  完成 CheckIn 合约测试
- [ ]  部署 CheckIn 到 Monad Testnet
- [ ]  保存 ABI 和合约地址
- [ ]  创建 React 项目
- [ ]  实现 MetaMask 连接
- [ ]  完成前端签到闭环
- [ ]  整理 Week 2 Proof of Work

---

# 第八部分：开发阶段规划

## 31. Week 2 开发阶段

### 阶段 1：CheckIn 合约

- [ ]  核查合约
- [ ]  测试未签到查询
- [ ]  测试首次签到
- [ ]  测试重复签到失败
- [ ]  测试多账户数据隔离
- [ ]  部署 Monad Testnet
- [ ]  保存 ABI、地址和交易 Hash

### 阶段 2：React 初始化

- [ ]  创建 React 项目
- [ ]  运行默认页面
- [ ]  整理目录
- [ ]  创建签到页面

### 阶段 3：钱包连接

- [ ]  检测 MetaMask
- [ ]  连接钱包
- [ ]  显示地址
- [ ]  检查网络
- [ ]  处理账户和网络切换

### 阶段 4：合约交互

- [ ]  创建合约实例
- [ ]  查询签到数据
- [ ]  调用签到函数
- [ ]  等待交易确认
- [ ]  展示交易 Hash

### 阶段 5：整理提交

- [ ]  README
- [ ]  截图
- [ ]  Build Log
- [ ]  AI Collaboration Log
- [ ]  Explorer 链接
- [ ]  Proof of Work

---

## 32. Week 3 开发阶段

### 阶段 1：团队与需求

- [ ]  确认团队成员
- [ ]  明确角色分工
- [ ]  确认核心用户问题
- [ ]  确认最小贡献闭环

### 阶段 2：Prototype 设计

- [ ]  项目页
- [ ]  任务页
- [ ]  贡献提交页
- [ ]  审核页
- [ ]  Profile 页

### 阶段 3：合约升级

- [ ]  项目和任务 ID
- [ ]  贡献提交
- [ ]  审核权限
- [ ]  贡献记录
- [ ]  贡献事件

### 阶段 4：前后端整合

- [ ]  前端调用合约
- [ ]  Spring Boot API
- [ ]  MySQL 数据表
- [ ]  链上事件同步
- [ ]  Profile 数据展示

### 阶段 5：Prototype 演示

- [ ]  完成完整用户流程
- [ ]  邀请测试用户
- [ ]  收集反馈
- [ ]  确认 Week 4 改进项

---

## 33. Week 4 开发阶段

- [ ]  修复核心问题
- [ ]  完善 UI 和错误提示
- [ ]  部署前端
- [ ]  部署后端
- [ ]  确认合约地址
- [ ]  完成链上测试
- [ ]  完成数据看板
- [ ]  完成 Pitch Deck
- [ ]  录制 Demo Video
- [ ]  准备 Final Presentation
- [ ]  提交 Hackathon 项目

---

# 第九部分：Proof of Work

## 34. Week 2 Proof of Work

- GitHub 仓库；
- CheckIn 合约源码；
- 合约地址；
- 部署 Transaction Hash；
- 签到 Transaction Hash；
- Explorer 链接；
- React 页面截图；
- 钱包连接截图；
- 签到成功截图；
- README；
- Week 2 Build Log；
- AI Collaboration Log。

---

## 35. Week 3—4 Proof of Work

- 可运行产品链接；
- 完整 GitHub Repo；
- Solidity 合约；
- Spring Boot 后端；
- MySQL 数据结构；
- 核心交易 Hash；
- Builder Profile；
- 贡献审核演示；
- 数据看板；
- 用户反馈；
- Demo Video；
- Pitch Deck；
- Final Presentation。

---

# 第十部分：AI 使用原则

## 36. AI 可以协助

- 需求拆解；
- 代码解释；
- 初始代码生成；
- Bug 定位；
- 测试用例设计；
- 项目结构优化；
- README 整理；
- 数据指标设计；
- Pitch 内容整理。

## 37. 必须人工完成

- 确认用户问题；
- 判断功能是否必要；
- 核查官方文档；
- 检查合约权限；
- 运行代码；
- 执行钱包签名；
- 验证交易结果；
- 确认错误是否解决；
- 审查安全风险；
- 确认提交内容真实有效。

## 38. 不得提供给 AI

- 私钥；
- 助记词；
- 钱包密码；
- API Secret；
- 数据库正式密码；
- 真实资产账户信息。

---

# 第十一部分：项目价值总结

## 39. Week 2 价值

证明我已经掌握：

```
钱包连接
+ 前端合约交互
+ Solidity
+ Monad Testnet
+ 交易确认
+ 链上数据读取
```

## 40. Week 3—4 价值

证明我能够：

```
识别真实问题
+ 设计 Web3 产品
+ 开发智能合约
+ 设计 Java 后端
+ 管理链上链下数据
+ 建立指标体系
+ 完成团队协作
+ 交付可验证产品
```

## 41. 最终项目定位

> Monad Builder Proof 是一个面向 Web3 社区、开源项目和 Hackathon 团队的链上贡献证明与 Builder 声誉平台。平台通过钱包身份、任务系统、贡献提交、项目方审核和链上记录，帮助 Builder 建立可验证、可携带的贡献档案，并通过 Spring Boot、MySQL 和数据看板提供高效的查询、分析和协作支持。