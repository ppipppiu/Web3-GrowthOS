# Monad Growth Intelligence PRD

> 面向 Monad DApp 的用户增长分析、用户分层、AI 运营策略与链上报告验证平台

---

## 1. 文档信息

| 项目   | 内容                                                     |
| ---- | ------------------------------------------------------ |
| 产品名称 | Monad Growth Intelligence                              |
| 产品类型 | Web3 用户增长与数据智能平台                                       |
| 当前版本 | Hackathon MVP v0.1                                     |
| 目标网络 | Monad                                                  |
| 目标用户 | Monad 生态早期 DApp 项目方与运营人员                               |
| 主要场景 | 用户行为分析、用户分层、运营策略生成、分析结果上链验证                            |
| 文档类型 | Product Requirements Document                          |
| 研究依据 | `Research/Web3-DApp-Market-and-Competitor-Research.md` |

---

# 2. 产品背景

## 2.1 市场背景

Web3 DApp 项目可以通过区块浏览器、数据查询平台和链上分析工具获得大量公开数据，例如：

* 钱包地址；
* 合约交互记录；
* 交易次数；
* 交易金额；
* 活跃地址；
* Token 转移记录；
* 奖励领取记录。

但是，原始链上数据并不能直接转化为用户增长决策。

多数早期 DApp 团队仍然需要回答：

* 当前有多少真实用户？
* 新用户是否完成了关键行为？
* 用户完成首次交互后是否继续使用？
* 哪些用户正在流失？
* 哪些用户值得继续激励？
* 哪些用户可能只为了领取奖励？
* 运营活动是否真正提高了用户留存？
* 项目下一步应该优先运营哪类用户？

现有平台通常分别解决数据查询、钱包画像、任务增长或营销归因中的某一部分，但早期项目仍然缺少一套能够连接以下流程的轻量工具：

```text
用户数据接入
→ 增长指标计算
→ 用户分层
→ 运营策略生成
→ 分析结果确认
→ 链上验证
```

---

## 2.2 Research 结论

根据前期 Web3 DApp 市场与竞品研究，可以将相关产品大致分为以下几类：

| 产品类型        | 主要价值          | 典型不足            |
| ----------- | ------------- | --------------- |
| 链上数据查询平台    | 查询交易、钱包和协议数据  | 使用门槛较高，结果需要人工解释 |
| 数据看板平台      | 展示用户数、交易量和活跃度 | 容易停留在普通 BI 看板   |
| AI 数据洞察工具   | 自动解释数据和生成摘要   | 容易只是重新总结数据      |
| Quest 与任务平台 | 获取用户并发放奖励     | 难以判断用户后续质量      |
| 钱包画像平台      | 分析钱包资产和行为标签   | 更偏投资、风控和资金行为    |
| 营销归因平台      | 追踪渠道到链上行为的转化  | 接入和使用成本较高       |
| 用户奖励平台      | 创建活动并执行奖励     | 缺少活动前后的用户质量评估   |

本项目不与大型数据平台竞争底层数据覆盖范围，而是重点解决：

> 项目方看完数据以后，下一步应该做什么。

---

# 3. 产品定义

## 3.1 产品定位

Monad Growth Intelligence 是一个面向 Monad DApp 项目的用户增长与数据智能平台。

项目方可以上传用户行为数据，系统自动完成：

1. 数据校验；
2. 用户增长指标计算；
3. 用户行为漏斗分析；
4. 用户分层；
5. AI 运营策略生成；
6. 分析报告哈希上链；
7. 分析报告真实性验证。

产品核心价值是：

> 帮助缺少专职数据分析师的 Monad DApp 团队，将分散的用户行为数据转化为可执行的增长策略。

---

## 3.2 一句话介绍

> Upload DApp user data, understand user behavior, generate growth strategies, and verify the final report on Monad.

---

## 3.3 产品核心闭环

```text
项目方上传数据
        ↓
系统清洗并计算指标
        ↓
生成增长数据看板
        ↓
完成用户分层
        ↓
AI 生成运营策略
        ↓
项目方确认分析报告
        ↓
报告哈希写入 Monad
        ↓
生成可验证的分析凭证
```

---

# 4. 产品目标

## 4.1 MVP 目标

Hackathon MVP 需要验证以下假设：

### 假设一：早期 DApp 项目需要低门槛的增长分析工具

项目方无需编写 SQL，也可以通过上传标准 CSV 获得基础增长分析。

### 假设二：数据看板需要连接运营策略

用户不仅需要看到指标，还需要知道：

* 哪个问题最严重；
* 应该优先运营哪类用户；
* 建议采取什么动作；
* 应该观察什么指标。

### 假设三：分析报告存在链上验证场景

通过将数据集哈希和报告哈希写入 Monad，可以证明：

* 哪个钱包生成了报告；
* 报告在什么时间生成；
* 报告对应哪份数据；
* 当前报告是否被修改。

---

## 4.2 MVP 成功标准

MVP 至少需要实现：

* 用户可以上传 CSV；
* 系统可以校验数据；
* 系统可以计算真实增长指标；
* 系统可以完成用户分层；
* 系统可以生成 AI 运营策略；
* 用户可以连接钱包；
* 用户可以将报告哈希写入 Monad；
* 用户可以验证报告与链上记录是否一致；
* 整个流程可以在演示环境中完成。

---

## 4.3 非目标

本次 MVP 不解决以下问题：

* 不建设完整企业级数据仓库；
* 不支持所有公链；
* 不自动解析任意智能合约；
* 不提供实时全链数据；
* 不训练复杂机器学习模型；
* 不直接执行真实大规模奖励；
* 不替代专业数据分析团队；
* 不声称 AI 建议一定能够提升增长；
* 不将完整用户数据上传到链上。

---

# 5. 目标用户

## 5.1 核心用户

### 用户类型一：DApp 创始人或项目负责人

特点：

* 团队规模较小；
* 没有专职数据分析师；
* 关注用户增长和产品留存；
* 需要快速判断项目现状；
* 需要向团队、社区或投资人汇报。

核心需求：

* 快速了解用户增长情况；
* 找出最需要解决的问题；
* 确定下一步产品和运营方向。

---

### 用户类型二：Web3 运营人员

特点：

* 负责社区、任务和激励活动；
* 熟悉用户运营，但不一定熟悉 SQL；
* 可以看到任务参与人数，但难以判断用户质量；
* 需要选择下一轮激励对象。

核心需求：

* 识别不同类型用户；
* 判断奖励是否有效；
* 获得可以直接执行的运营建议。

---

### 用户类型三：DApp 开发者

特点：

* 可以获取智能合约事件；
* 知道用户做过什么链上操作；
* 不熟悉用户增长分析；
* 希望快速增加分析能力。

核心需求：

* 使用统一数据格式接入行为数据；
* 快速生成分析看板；
* 验证项目的数据分析流程。

---

## 5.2 MVP 优先用户

本次 MVP 优先服务：

> Monad 生态内的早期交易类 DApp 项目。

包括：

* DEX；
* Swap 产品；
* Meme Token 交易平台；
* 链上资产交易产品；
* 预测市场；
* 游戏资产交易市场。

选择交易类 DApp 的原因：

* 用户关键行为相对明确；
* 交互次数和金额容易统计；
* 首次交易和重复交易可以形成漏斗；
* 用户分层规则容易解释；
* 更适合在有限时间内制作完整 Demo。

---

# 6. 用户痛点

## 6.1 数据获取后仍然不会分析

项目方可能已经拥有钱包和交易数据，但不知道应该计算哪些指标。

常见问题包括：

* 只看总交易量；
* 只看钱包数量；
* 没有区分新增和存量用户；
* 没有观察重复交互；
* 没有进行用户分层；
* 无法判断活动是否带来长期价值。

---

## 6.2 数据工具使用门槛较高

现有链上数据平台通常需要用户具备：

* SQL；
* 链上数据表结构知识；
* 智能合约事件知识；
* 指标体系设计能力；
* 数据可视化能力。

早期项目可能没有足够的人力和时间完成完整分析。

---

## 6.3 任务参与量不等于真实增长

项目方开展奖励活动后，可能获得大量钱包参与，但仍然不知道：

* 用户是否持续使用；
* 用户是否只完成最低任务；
* 是否存在激励低效用户；
* 活动结束后是否继续交互；
* 奖励成本是否值得。

---

## 6.4 AI 建议缺少数据依据

如果只是将问题直接交给普通大模型，AI 可能：

* 输出通用建议；
* 没有引用具体数据；
* 编造不存在的结果；
* 将相关性错误解释为因果；
* 每次输出不同格式；
* 无法直接在产品中展示。

---

## 6.5 分析报告缺少公开验证

传统报告通常保存在中心化数据库或本地文件中，外部人员无法确认：

* 报告是否被修改；
* 数据版本是否一致；
* 报告何时生成；
* 报告由哪个钱包确认。

---

# 7. 竞品与差异化

## 7.1 竞品分类

### 数据查询和看板产品

代表能力：

* SQL 查询；
* 协议数据；
* 钱包数据；
* 自定义 Dashboard。

不足：

* 用户需要理解数据；
* 运营建议较弱；
* 难以直接转化为行动。

---

### 钱包画像产品

代表能力：

* 钱包标签；
* 资产持仓；
* 资金流向；
* 高价值钱包识别。

不足：

* 更偏投资和市场情报；
* 不一定基于某个 DApp 内部生命周期分析用户。

---

### AI 数据工具

代表能力：

* 自动摘要；
* 自然语言查询；
* 数据解释。

不足：

* AI 可能只是重新描述指标；
* 输出未必可验证；
* 缺少确定性的指标计算过程。

---

### Quest 和用户奖励平台

代表能力：

* 创建任务；
* 验证行为；
* 发放奖励；
* 用户拉新。

不足：

* 难以衡量奖励后的留存；
* 容易吸引奖励导向用户；
* 缺少用户质量评估。

---

## 7.2 本项目差异化

### 差异化一：面向 Monad 早期项目

第一版只围绕 Monad 和交易类 DApp 设计，避免同时支持过多链和业务类型。

---

### 差异化二：不要求 SQL

用户通过标准 CSV 或 Demo 数据即可完成分析。

```text
上传数据
→ 自动校验
→ 自动计算
→ 自动展示
```

---

### 差异化三：从数据走向运营策略

系统不只展示：

```text
7 日复交互率为 18%
```

还需要解释：

```text
当前主要问题是首次交互后的二次转化较低。

建议优先针对完成首次交互但 7 日内没有再次交互的用户设计召回活动。
```

---

### 差异化四：确定性计算与 AI 解释分离

核心指标由 Python 程序计算，AI 只负责：

* 解释结果；
* 发现问题；
* 生成策略；
* 提醒风险。

避免 AI 直接计算核心指标。

---

### 差异化五：报告可上链验证

用户确认最终结果后，将：

* 数据集哈希；
* 报告哈希；
* 请求钱包；
* 创建时间；

写入 Monad。

---

# 8. 产品范围

MVP 由四个核心模块组成：

1. Data Connect；
2. Growth Dashboard；
3. AI Growth Strategy；
4. Verified Analysis。

---

# 9. 功能一：Data Connect

## 9.1 功能描述

用户创建分析项目，并上传 DApp 用户行为数据。

---

## 9.2 用户输入

用户需要填写：

| 字段             | 说明      | 必填        |
| -------------- | ------- | --------- |
| Project Name   | 项目名称    | 是         |
| DApp Type      | DApp 类型 | 是         |
| Analysis Goal  | 分析目标    | 是         |
| Data Source    | 数据来源    | 是         |
| Wallet Address | 当前连接钱包  | 生成链上报告时必填 |

---

## 9.3 DApp 类型

MVP 页面可以提供：

* DEX；
* GameFi；
* NFT；
* Generic DApp。

但只有 DEX 提供完整分析模板。

其他类型显示：

```text
Coming Soon
```

这样既可以展示产品扩展方向，又不会扩大本次开发范围。

---

## 9.4 数据接入方式

MVP 支持两种方式：

### 方式一：上传 CSV

用户上传符合标准格式的数据。

### 方式二：使用 Demo Dataset

用户不准备文件时，可以直接使用内置示例数据体验完整流程。

---

## 9.5 数据字段要求

### 必填字段

| 字段             | 类型       | 含义     |
| -------------- | -------- | ------ |
| wallet_address | string   | 用户钱包地址 |
| event_type     | string   | 用户行为类型 |
| timestamp      | datetime | 行为发生时间 |

### 可选字段

| 字段            | 类型     | 含义       |
| ------------- | ------ | -------- |
| amount        | number | 交易金额     |
| tx_hash       | string | 交易哈希     |
| campaign_id   | string | 活动编号     |
| reward_amount | number | 奖励金额     |
| token_symbol  | string | Token 名称 |
| status        | string | 交易状态     |

---

## 9.6 示例 CSV

```csv
wallet_address,event_type,amount,timestamp,tx_hash,campaign_id,reward_amount
0x123...,swap,100,2026-07-01 10:00:00,0xaaa...,campaign_01,0
0x456...,swap,25,2026-07-02 15:20:00,0xbbb...,campaign_01,0.1
0x123...,swap,80,2026-07-05 12:10:00,0xccc...,,0
```

---

## 9.7 数据校验

系统需要检查：

* 文件是否为 CSV；
* 必填字段是否存在；
* 钱包地址是否符合基础格式；
* 时间字段是否可以解析；
* 金额字段是否为数字；
* 是否存在重复记录；
* 是否存在空钱包；
* 是否存在异常时间；
* 数据量是否为空。

---

## 9.8 数据校验结果

系统显示：

```text
Total records: 1,248
Valid records: 1,231
Invalid records: 17
Unique wallets: 326
Date range: 2026-06-01 to 2026-07-20
```

并展示前五行数据预览。

---

## 9.9 异常处理

| 异常     | 系统行为         |
| ------ | ------------ |
| 缺少必填字段 | 阻止分析并提示字段名称  |
| 钱包为空   | 标记为无效记录      |
| 时间无法解析 | 标记为无效记录      |
| 金额为空   | 可按照零或缺失值处理   |
| 存在重复记录 | 自动去重并提示数量    |
| 文件为空   | 阻止分析         |
| 文件过大   | 提示 MVP 数据量限制 |

---

## 9.10 验收标准

* 用户能够上传 CSV；
* 页面能够展示文件名称；
* 系统能够返回数据摘要；
* 系统能够识别缺失字段；
* 系统能够展示有效和无效记录数量；
* 用户能够使用 Demo Dataset；
* 数据校验通过后可以进入分析页面。

---

# 10. 功能二：Growth Dashboard

## 10.1 功能描述

后端根据上传数据完成确定性计算，前端生成增长数据看板。

---

## 10.2 数据处理流程

```text
原始 CSV
→ 字段标准化
→ 数据去重
→ 时间格式转换
→ 用户级聚合
→ 指标计算
→ 用户分层
→ 返回 Dashboard JSON
```

---

## 10.3 核心指标

### 用户规模

* Total Users；
* New Users；
* Active Users；
* Rewarded Users。

### 用户行为

* Total Events；
* Average Events per User；
* Total Volume；
* Average Volume per User；
* Average Active Days。

### 转化

* First Interaction Users；
* Second Interaction Users；
* Repeat Interaction Rate；
* Users with Three or More Interactions。

### 留存

* 7-Day Repeat Interaction Rate；
* 14-Day Repeat Interaction Rate；
* Recently Active Users；
* At-Risk Users。

### 活动效果

* Campaign Users；
* Non-Campaign Users；
* Campaign Repeat Rate；
* Non-Campaign Repeat Rate；
* Reward Cost；
* Cost per Additional Retained User。

---

## 10.4 MVP 核心指标卡

首页优先显示六个指标：

1. Total Users；
2. Active Users；
3. Repeat Interaction Rate；
4. 7-Day Retention；
5. Total Volume；
6. At-Risk Users。

---

## 10.5 增长漏斗

DEX 模板使用以下漏斗：

```text
All Users
→ First Transaction
→ Second Transaction
→ Three or More Transactions
→ High-Value Users
```

每个阶段展示：

* 用户数量；
* 与上一阶段的转化率；
* 总体转化率。

---

## 10.6 趋势分析

MVP 支持：

* 每日新增用户趋势；
* 每日活跃用户趋势；
* 每日交易次数趋势；
* 每日交易金额趋势。

---

## 10.7 用户分层

MVP 采用规则分层。

### 新用户

参考规则：

```text
交互次数等于 1
```

特点：

* 已经完成初次体验；
* 尚未形成重复使用行为。

---

### 活跃用户

参考规则：

```text
最近 7 天交互次数不少于 3 次
```

特点：

* 当前保持稳定使用；
* 可以进一步引导使用高级功能。

---

### 高价值用户

参考规则：

```text
交易金额、交互次数或贡献位于前 20%
```

特点：

* 对项目交易量或收入贡献较高；
* 需要重点维护。

---

### 流失风险用户

参考规则：

```text
历史上交互次数不少于 2 次，但最近 7 天或 14 天没有交互
```

特点：

* 曾经使用过产品；
* 当前存在流失风险；
* 适合进行召回。

---

### 激励低效用户

参考规则：

```text
领取过奖励，但奖励后没有继续交互
```

特点：

* 对奖励敏感；
* 对产品本身的持续使用意愿较低；
* 不适合继续无差别补贴。

---

## 10.8 用户列表

系统展示：

| 字段                 | 说明     |
| ------------------ | ------ |
| Wallet Address     | 用户钱包   |
| Event Count        | 总交互次数  |
| Total Amount       | 总交易金额  |
| Active Days        | 活跃天数   |
| Last Active Time   | 最近交互时间 |
| Reward Received    | 是否获得奖励 |
| Segment            | 用户分层   |
| Recommended Action | 推荐动作   |

---

## 10.9 分层解释

用户点击某个钱包时，需要展示其分层原因，例如：

```text
Segment: At-Risk User

Reason:
- The wallet completed 6 transactions.
- It was previously active on 4 different days.
- No new interaction occurred in the last 10 days.
```

---

## 10.10 验收标准

* Dashboard 数字来自上传数据计算；
* 指标不能写死；
* 页面展示不少于四个核心指标；
* 页面展示用户漏斗；
* 页面展示用户分层分布；
* 页面展示用户列表；
* 用户可以查看分层原因；
* 数据变化后指标随之变化。

---

# 11. 功能三：AI Growth Strategy

## 11.1 功能描述

系统根据后端计算完成的结构化指标生成用户运营策略。

AI 不直接负责：

* 数据清洗；
* 用户数量计算；
* 留存率计算；
* 交易金额统计；
* 图表生成。

AI 负责：

* 解释数据；
* 找出增长问题；
* 判断优先级；
* 推荐目标用户；
* 推荐运营动作；
* 推荐观察指标；
* 提醒策略风险。

---

## 11.2 AI 输入

AI 接收结构化指标，而不是整份原始 CSV。

示例：

```json
{
  "project_type": "DEX",
  "total_users": 320,
  "active_users": 62,
  "repeat_interaction_rate": 0.18,
  "retention_7d": 0.21,
  "segments": {
    "new_users": 143,
    "active_users": 62,
    "high_value_users": 24,
    "at_risk_users": 71,
    "low_efficiency_incentive_users": 20
  },
  "campaign": {
    "campaign_retention": 0.23,
    "non_campaign_retention": 0.17,
    "reward_cost": 120
  }
}
```

---

## 11.3 AI 输出结构

AI 必须返回固定 JSON。

```json
{
  "summary": "The main growth problem is the low repeat interaction rate.",
  "findings": [
    {
      "title": "Low repeat interaction rate",
      "evidence": "Only 18% of users completed a second interaction.",
      "priority": "high"
    }
  ],
  "strategies": [
    {
      "target_segment": "at_risk_users",
      "action": "Launch a limited-time reactivation campaign.",
      "reason": "These users already understand the product and may be cheaper to reactivate than acquiring new users.",
      "recommended_metric": "7-day reactivation rate"
    }
  ],
  "risks": [
    "The current sample is limited and should not be interpreted as causal evidence."
  ]
}
```

---

## 11.4 策略卡片字段

每条策略展示：

* Strategy Title；
* Target Segment；
* Problem；
* Data Evidence；
* Recommended Action；
* Reason；
* Success Metric；
* Priority；
* Risk。

---

## 11.5 预设分析 Skill

AI Prompt 按照三个步骤运行。

### Step 1：Growth Analyst

分析：

* 用户规模；
* 转化；
* 留存；
* 用户结构；
* 活动效果。

输出最主要的 1 至 3 个问题。

---

### Step 2：Web3 Operations Strategist

针对问题生成：

* 目标人群；
* 运营动作；
* 激励方式；
* 观察指标；
* 执行优先级。

---

### Step 3：Evidence Checker

检查：

* 建议是否引用具体数据；
* 是否存在没有数据依据的结论；
* 是否将相关性解释为因果；
* 是否存在过度激励；
* 是否忽略奖励猎人风险。

---

## 11.6 本地规则回退

当 AI API 不可用时，系统使用本地规则生成基础建议。

### 规则一

```text
如果 Repeat Interaction Rate < 20%
→ 建议优化首次交互后的二次行为引导
```

### 规则二

```text
如果 At-Risk Users 占比 > 30%
→ 建议开展 7 日召回活动
```

### 规则三

```text
如果 Campaign Retention 与 Non-Campaign Retention 差异较小
→ 建议停止无差别奖励
```

### 规则四

```text
如果 Low-Efficiency Incentive Users 占比较高
→ 建议提高奖励领取条件
```

---

## 11.7 AI 风险提示

页面必须声明：

* AI 策略仅用于辅助决策；
* 指标结果不代表因果关系；
* 数据量过小时结论可靠性有限；
* 项目方需要结合业务背景确认策略；
* 不建议直接执行高成本奖励活动。

---

## 11.8 验收标准

* AI 输入来自后端指标 JSON；
* AI 不直接读取完整 CSV；
* AI 返回固定结构；
* 每条结论包含数据证据；
* 每条策略包含目标用户；
* 每条策略包含观察指标；
* AI 失败时系统仍能返回基础策略；
* 页面不展示无法解析的原始 AI 文本。

---

# 12. 功能四：Verified Analysis

## 12.1 功能描述

用户确认分析结果后，将数据集哈希和报告哈希写入 Monad。

---

## 12.2 产品原则

普通分析预览不需要上链。

平台提供两个操作：

### Preview Analysis

* 不需要钱包签名；
* 不产生交易；
* 可以重复运行；
* 用于查看指标和策略。

### Generate Verified Report

* 生成正式报告；
* 计算数据集哈希；
* 计算报告哈希；
* 用户确认钱包交易；
* 将分析凭证写入 Monad。

---

## 12.3 上链内容

| 字段               | 是否上链 |
| ---------------- | ---- |
| Requester Wallet | 是    |
| Dataset Hash     | 是    |
| Report Hash      | 是    |
| Analysis Type    | 是    |
| Created Time     | 是    |
| Project Name     | 可选   |
| 原始 CSV           | 否    |
| 用户明细             | 否    |
| AI 完整输出          | 否    |
| 图表               | 否    |

---

## 12.4 链上流程

```text
系统生成最终报告
→ 生成规范化报告 JSON
→ 计算 datasetHash
→ 计算 reportHash
→ 用户连接钱包
→ 用户确认交易
→ 调用 AnalysisRegistry 合约
→ Monad 保存分析记录
→ 返回 Analysis ID
→ 返回 Transaction Hash
```

---

## 12.5 智能合约

合约名称：

```text
AnalysisRegistry.sol
```

数据结构：

```solidity
struct AnalysisRecord {
    address requester;
    bytes32 datasetHash;
    bytes32 reportHash;
    uint256 analysisType;
    uint256 createdAt;
}
```

事件：

```solidity
event AnalysisRecorded(
    uint256 indexed analysisId,
    address indexed requester,
    bytes32 indexed datasetHash,
    bytes32 reportHash,
    uint256 analysisType,
    uint256 createdAt
);
```

核心函数：

```solidity
function recordAnalysis(
    bytes32 datasetHash,
    bytes32 reportHash,
    uint256 analysisType
) external returns (uint256);
```

查询函数：

```solidity
function getAnalysis(
    uint256 analysisId
) external view returns (AnalysisRecord memory);
```

---

## 12.6 报告验证

用户输入：

* Analysis ID；
* Transaction Hash；
* Report ID。

系统重新计算当前报告哈希，并与 Monad 上的 `reportHash` 对比。

验证状态：

### Verified

```text
The current report matches the on-chain record.
```

### Modified

```text
The current report does not match the on-chain record.
```

### Not Found

```text
No matching analysis record was found.
```

---

## 12.7 验收标准

* 用户能够连接 MetaMask；
* 系统能够识别 Monad 网络；
* 系统能够生成 datasetHash；
* 系统能够生成 reportHash；
* 用户可以调用合约；
* 交易成功后展示 Transaction Hash；
* 页面能够读取链上记录；
* 页面能够验证当前报告；
* 原始用户数据不会写入链上。

---

# 13. 页面结构

## 13.1 Landing Page

内容：

* 产品一句话介绍；
* 核心价值；
* Try Demo；
* Create Project；
* Connect Wallet；
* 产品工作流程。

---

## 13.2 Create Project

内容：

* Project Name；
* DApp Type；
* Analysis Goal；
* Data Source；
* Upload CSV；
* Use Demo Dataset。

---

## 13.3 Data Validation

内容：

* Total Records；
* Valid Records；
* Invalid Records；
* Unique Wallets；
* Date Range；
* Field Validation；
* Data Preview。

---

## 13.4 Growth Dashboard

内容：

* 核心指标卡；
* 用户增长趋势；
* 增长漏斗；
* 用户分层分布；
* 用户表；
* 分层解释。

---

## 13.5 AI Strategy

内容：

* Growth Summary；
* Key Findings；
* Priority；
* Target Segment；
* Recommended Action；
* Success Metric；
* Risk Warning。

---

## 13.6 Verified Report

内容：

* 完整分析摘要；
* Dataset Hash；
* Report Hash；
* Requester Wallet；
* Generate Verified Report；
* Wallet Transaction Status；
* Transaction Hash；
* Analysis ID。

---

## 13.7 Verify Report

内容：

* Analysis ID 输入；
* 链上记录；
* 当前报告哈希；
* 验证状态；
* Requester；
* Created Time；
* Transaction Hash。

---

# 14. 完整用户流程

## 14.1 预览分析流程

```text
进入平台
→ 创建项目
→ 上传 CSV
→ 数据校验
→ 点击 Analyze Data
→ 查看 Growth Dashboard
→ 点击 Generate Strategy
→ 查看 AI 运营策略
```

该流程不需要区块链交易。

---

## 14.2 正式报告流程

```text
查看分析结果
→ 确认最终报告
→ 连接 MetaMask
→ 点击 Generate Verified Report
→ 计算数据和报告哈希
→ 钱包确认交易
→ Monad 写入记录
→ 返回 Analysis ID
→ 查看验证结果
```

---

# 15. 技术架构

```text
用户
 │
 ├── 上传 CSV
 ├── 使用 Demo Dataset
 └── 连接 MetaMask
         │
         ▼
      Next.js
         │
         ├── 项目创建
         ├── 数据上传
         ├── Dashboard
         ├── AI 策略卡片
         ├── 报告页面
         └── 钱包交互
         │
         ▼
      FastAPI
         │
         ├── 数据校验
         ├── pandas 数据清洗
         ├── 用户级聚合
         ├── 指标计算
         ├── 用户分层
         ├── AI API 调用
         ├── 报告生成
         └── Hash 计算
         │
         ├──────────────┐
         ▼              ▼
      Database       AI API
         │              │
         │              ▼
         │         Strategy JSON
         │
         ▼
      Next.js
         │
         ▼
      wagmi / viem
         │
         ▼
      Monad
         │
         ├── requester
         ├── datasetHash
         ├── reportHash
         └── createdAt
```

---

# 16. 技术选型

## 16.1 前端

| 技术           | 用途       |
| ------------ | -------- |
| Next.js      | 前端框架     |
| TypeScript   | 类型检查     |
| Tailwind CSS | 页面样式     |
| Recharts     | 数据可视化    |
| Papa Parse   | CSV 初步解析 |
| wagmi        | 钱包连接     |
| viem         | 合约交互     |

---

## 16.2 后端

| 技术       | 用途         |
| -------- | ---------- |
| FastAPI  | API 服务     |
| Python   | 数据处理       |
| pandas   | 数据清洗和指标计算  |
| Pydantic | 输入输出校验     |
| SQLite   | MVP 数据存储   |
| hashlib  | 数据和报告 Hash |
| Web3.py  | 可选链上读取     |

---

## 16.3 AI

| 技术                   | 用途       |
| -------------------- | -------- |
| Gemini API 或兼容模型 API | 策略生成     |
| System Prompt        | 预设分析流程   |
| JSON Schema          | 约束输出     |
| Pydantic             | 验证输出     |
| Local Rule Engine    | API 失败回退 |

---

## 16.4 区块链

| 技术             | 用途      |
| -------------- | ------- |
| Solidity       | 智能合约    |
| Remix          | 合约开发与部署 |
| Monad          | 目标网络    |
| MetaMask       | 钱包签名    |
| wagmi / viem   | 前端调用    |
| Monad Explorer | 交易验证    |

---

## 16.5 部署

| 模块          | 推荐平台              |
| ----------- | ----------------- |
| Frontend    | Vercel            |
| Backend     | Render 或 Railway  |
| Database    | SQLite 或 Supabase |
| Contract    | Monad             |
| Source Code | GitHub            |
| AI API      | Gemini API        |
| Demo Video  | YouTube 或黑客松支持平台  |

---

# 17. 后端 API

## 创建项目

```http
POST /api/projects
```

---

## 上传数据

```http
POST /api/projects/{project_id}/upload
```

返回：

```json
{
  "total_rows": 1248,
  "valid_rows": 1231,
  "invalid_rows": 17,
  "wallet_count": 326,
  "start_date": "2026-06-01",
  "end_date": "2026-07-20"
}
```

---

## 执行分析

```http
POST /api/projects/{project_id}/analyze
```

返回：

```json
{
  "overview": {},
  "funnel": [],
  "trend": [],
  "retention": {},
  "segments": {},
  "users": []
}
```

---

## 生成策略

```http
POST /api/projects/{project_id}/strategy
```

返回：

```json
{
  "summary": "",
  "findings": [],
  "strategies": [],
  "risks": []
}
```

---

## 生成正式报告

```http
POST /api/projects/{project_id}/report
```

返回：

```json
{
  "report_id": "report_001",
  "dataset_hash": "0x...",
  "report_hash": "0x..."
}
```

---

## 验证报告

```http
GET /api/reports/{report_id}/verify
```

返回：

```json
{
  "verified": true,
  "requester": "0x...",
  "dataset_hash": "0x...",
  "report_hash": "0x...",
  "created_at": "2026-07-28T14:30:00"
}
```

---

# 18. 数据模型

## 18.1 Project

| 字段            | 类型       |
| ------------- | -------- |
| project_id    | string   |
| project_name  | string   |
| dapp_type     | string   |
| analysis_goal | string   |
| owner_wallet  | string   |
| created_at    | datetime |

---

## 18.2 User Event

| 字段             | 类型       |
| -------------- | -------- |
| wallet_address | string   |
| event_type     | string   |
| amount         | number   |
| timestamp      | datetime |
| tx_hash        | string   |
| campaign_id    | string   |
| reward_amount  | number   |

---

## 18.3 User Profile

| 字段                    | 类型       |
| --------------------- | -------- |
| wallet_address        | string   |
| first_event_time      | datetime |
| last_event_time       | datetime |
| event_count           | integer  |
| total_amount          | number   |
| active_days           | integer  |
| days_since_last_event | integer  |
| reward_received       | number   |
| segment               | string   |

---

## 18.4 Analysis Report

| 字段               | 类型       |
| ---------------- | -------- |
| report_id        | string   |
| project_id       | string   |
| metrics_json     | json     |
| strategy_json    | json     |
| dataset_hash     | string   |
| report_hash      | string   |
| requester_wallet | string   |
| transaction_hash | string   |
| analysis_id      | integer  |
| created_at       | datetime |

---

# 19. 核心规则

## 19.1 新用户

```text
event_count = 1
```

---

## 19.2 活跃用户

```text
events_in_last_7_days >= 3
```

---

## 19.3 高价值用户

```text
total_amount >= dataset 80th percentile
```

或：

```text
event_count >= dataset 80th percentile
```

---

## 19.4 流失风险用户

```text
historical_event_count >= 2
AND
days_since_last_event > 7
```

---

## 19.5 激励低效用户

```text
reward_received > 0
AND
no follow-up interaction after reward
```

---

# 20. 非功能需求

## 20.1 性能

MVP 目标：

* CSV 上传后在合理时间内完成分析；
* Demo 数据规模控制在数千至数万条以内；
* AI 请求设置超时；
* 页面显示加载状态。

---

## 20.2 安全

* AI API Key 只能存放在后端；
* 不在前端代码暴露密钥；
* 上传文件需要限制类型；
* 不执行用户上传的代码；
* 钱包私钥永远不传给平台；
* 原始数据默认不上链；
* 不将完整钱包行为提交给 AI。

---

## 20.3 隐私

* 只收集完成分析所需的数据；
* 不要求用户上传真实身份；
* 不自动关联邮箱、社交账号和钱包；
* 报告上链前明确展示上链字段；
* 用户明细只保存在链下。

---

## 20.4 可解释性

每个用户分层必须展示判断依据。

每条 AI 策略必须包含：

* 数据证据；
* 目标用户；
* 推荐动作；
* 观察指标；
* 风险提示。

---

## 20.5 可靠性

AI API 失败时：

* 不影响数据看板；
* 不影响用户分层；
* 使用本地规则返回策略；
* 页面显示当前使用的是 fallback strategy。

---

# 21. 产品指标

## 21.1 Demo 使用指标

* 上传成功率；
* 数据分析成功率；
* AI 策略生成成功率；
* 链上报告生成成功率；
* 报告验证成功率；
* 完整流程完成率。

---

## 21.2 后续产品指标

正式产品阶段可以观察：

* 创建项目数量；
* 活跃项目数量；
* 每个项目分析次数；
* Verified Report 数量；
* AI 建议采纳率；
* 用户复访率；
* 数据接入成功率；
* 报告分享次数。

---

# 22. 风险与限制

## 22.1 数据质量风险

如果用户上传的数据字段不完整或口径错误，分析结果也会受到影响。

解决方式：

* 强制字段校验；
* 显示数据质量摘要；
* 对异常数据进行提示；
* 提供标准数据模板。

---

## 22.2 AI 幻觉风险

AI 可能输出没有数据支持的建议。

解决方式：

* 只输入结构化指标；
* 要求引用具体数据；
* 使用固定 JSON Schema；
* 增加 Evidence Checker；
* 设置本地规则回退。

---

## 22.3 因果解释风险

活动组表现更好，不一定代表活动导致了结果改善。

解决方式：

* 页面避免使用“活动导致”；
* 使用“活动组表现高于非活动组”；
* 增加相关性而非因果性的提示；
* 后续版本再加入实验设计或因果推断。

---

## 22.4 Web3 必要性风险

如果所有点击都要求上链，容易形成“为了 Web3 而 Web3”。

解决方式：

* 普通分析完全链下；
* 只有正式报告确认时上链；
* 链上只保存具备验证价值的哈希。

---

## 22.5 开发周期风险

如果同时开发多链、实时索引和奖励合约，无法按时完成。

解决方式：

* 只支持 Monad；
* 只完成 DEX 分析模板；
* 以 CSV 为主要数据来源；
* 只开发 AnalysisRegistry 合约；
* 暂不实现真实奖励发放。

---

# 23. 开发优先级

## P0：必须完成

* CSV 上传；
* 数据校验；
* Dashboard；
* 用户分层；
* 用户列表；
* AI 策略；
* 本地规则回退；
* MetaMask 连接；
* AnalysisRegistry 合约；
* 报告 Hash 上链；
* 报告验证页面。

---

## P1：时间允许时完成

* 项目历史记录；
* 用户详情页；
* CSV 模板下载；
* 用户筛选；
* 报告导出；
* Monad Explorer 跳转；
* 更完整的错误提示。

---

## P2：后续版本

* 合约地址自动接入；
* 任意 ABI 解析；
* Monad 事件实时同步；
* 多链支持；
* Campaign 创建；
* 奖励发放；
* 因果推断；
* 流失预测；
* Uplift Model；
* 多 Agent；
* Discord 和 Telegram 集成。

---

# 24. 开发排期

## Day 1：需求和数据规范

完成：

* PRD；
* 页面流程；
* CSV Schema；
* 用户分层规则；
* API 结构；
* 合约字段。

---

## Day 2：数据后端

完成：

* CSV 读取；
* 数据校验；
* 数据清洗；
* 用户级聚合；
* 核心指标；
* 用户分层。

---

## Day 3：Dashboard

完成：

* 文件上传；
* 数据校验页面；
* 指标卡；
* 漏斗；
* 用户分层图；
* 用户表。

---

## Day 4：AI 策略

完成：

* AI API；
* Prompt；
* JSON Schema；
* 策略卡片；
* 本地规则回退。

---

## Day 5：Monad 合约

完成：

* AnalysisRegistry.sol；
* Remix 测试；
* Monad 部署；
* 合约调用测试；
* 交易 Hash 和事件记录。

---

## Day 6：前端链上联调

完成：

* MetaMask；
* Monad 网络；
* Hash 生成；
* 合约调用；
* 交易状态展示。

---

## Day 7：报告验证

完成：

* 正式报告；
* Analysis ID；
* Report Verification；
* 链上数据读取。

---

## Day 8：部署

完成：

* Frontend；
* Backend；
* 环境变量；
* AI Key；
* 完整流程测试。

---

## Day 9：提交材料

完成：

* README；
* 架构图；
* 产品流程图；
* 演示视频；
* Demo 文稿；
* 合约地址；
* 关键交易 Hash。

---

## Day 10：缓冲

完成：

* Bug 修复；
* 部署检查；
* 演示数据优化；
* 提交链接检查。

---

# 25. Demo 演示脚本

## 第一步：介绍问题

> Monad DApp 项目可以看到钱包数和交易量，但很难快速判断哪些用户值得运营、哪些用户正在流失，以及奖励是否真正带来了持续使用。

---

## 第二步：上传数据

操作：

1. 创建 DEX 项目；
2. 上传 CSV；
3. 查看数据校验结果。

---

## 第三步：查看 Dashboard

展示：

* Total Users；
* Repeat Interaction Rate；
* 7-Day Retention；
* User Funnel；
* User Segments。

---

## 第四步：查看策略

展示系统发现：

* 二次交互率较低；
* 流失风险用户较多；
* 部分奖励用户没有后续行为。

AI 建议：

* 优先召回历史活跃用户；
* 不继续向全部用户发放无门槛奖励；
* 观察 7 日重新交互率。

---

## 第五步：生成链上报告

操作：

1. 点击 Generate Verified Report；
2. MetaMask 确认；
3. Monad 交易完成；
4. 展示 Transaction Hash；
5. 展示 Analysis ID。

---

## 第六步：验证报告

进入 Verify Report 页面。

展示：

```text
Verification Status: Verified
```

说明：

> 当前报告内容与 Monad 上记录的报告哈希一致，证明报告没有被修改。

---

# 26. 黑客松验收标准

项目需要至少提供：

* 可访问的 Web Demo；
* GitHub 仓库；
* Monad 合约地址；
* 成功交易 Hash；
* 可上传的示例 CSV；
* 数据看板；
* 用户分层；
* AI 策略；
* 链上报告；
* 报告验证页面；
* README；
* 架构图；
* 2 至 3 分钟演示视频。

---

# 27. 后续产品路线

## Phase 1：Hackathon MVP

```text
CSV 数据
→ Dashboard
→ 用户分层
→ AI 策略
→ 报告上链
```

---

## Phase 2：Monad Native Analytics

增加：

* 输入合约地址；
* 读取智能合约事件；
* 自动生成链上用户数据；
* 支持定时同步；
* 支持更多 DApp 模板。

---

## Phase 3：Campaign Intelligence

增加：

* 活动组与对照组；
* 活动效果分析；
* 奖励成本分析；
* 目标用户选择；
* Campaign 创建。

---

## Phase 4：Onchain Activation

增加：

* 奖励合约；
* Merkle Claim；
* 精准奖励；
* 活动执行记录；
* 奖励后留存分析。

---

## Phase 5：Predictive Growth

增加：

* 流失预测；
* 用户价值预测；
* 激励敏感度；
* Uplift Model；
* Causal Forest；
* 自动运营建议。

---

# 28. 最终结论

Monad Growth Intelligence 不试图成为另一个大型链上数据平台。

项目的核心价值是将以下能力连接起来：

```text
数据接入
→ 确定性分析
→ 用户分层
→ AI 运营策略
→ Monad 链上验证
```

其中：

* 数据接入解决分析入口问题；
* Dashboard 解决数据理解问题；
* 用户分层解决运营对象问题；
* AI 策略解决下一步行动问题；
* 链上凭证解决报告验证问题。

本次 Hackathon MVP 将优先证明一个最小但完整的闭环：

> 项目方上传 DApp 用户行为数据，获得增长分析和运营策略，并将最终报告生成可在 Monad 上验证的分析凭证。
