# Monad Growth Intelligence — Development Record

## 1. 当前版本

**Demo Version：v0.1**

当前 Demo 已经完成从链上交易 CSV 到用户增长分析结果的最小可运行闭环：

```text
上传交易 CSV
→ 数据校验
→ 数据清洗
→ 钱包级用户聚合
→ 增长指标计算
→ 用户分层
→ 前端 Dashboard 展示
```

## 2. 当前完成状态
| 模块                        | 状态     |
| ------------------------- | ------ |
| Data Preparation          | ✅ 已完成  |
| Backend Setup             | ✅ 已完成  |
| Validation Layer          | ✅ 已完成  |
| Cleaning Layer            | ✅ 已完成  |
| API Integration           | ✅ 已完成  |
| Wallet Aggregation        | ✅ 已完成  |
| Metrics Layer             | ✅ 已完成  |
| Segmentation Layer        | ✅ 已完成  |
| Frontend Demo             | ✅ 已完成  |
| AI Insight                | ⏳ 后续版本 |
| Monad Report Verification | ⏳ 后续版本 |

## 3. 已完成内容
### 3.1 Demo 数据准备

已完成：

- 创建模拟链上交易数据；
- 创建包含异常记录的测试数据；
- 定义交易数据字段；
- 支持多次运行测试；
- 保留原始测试数据。

当前主要输入字段：
```
wallet_address
transaction_hash
block_time
action_type
amount_usd
token_symbol
gas_fee_usd
transaction_status
```

### 3.2 FastAPI 后端

已完成 FastAPI 服务初始化。

当前接口：
```
GET /
```
用于确认 API 是否启动。
```
GET /health
```
用于检查后端服务状态。
```
POST /api/analyze
```
用于上传 CSV 并执行完整分析流程。

### 3.3 数据校验
系统可以检查：

- CSV 必填字段是否完整；
- 关键字段是否存在缺失值；
- transaction_hash 是否重复；
- block_time 是否可以解析；
- amount_usd 是否为有效数字；
- 是否存在负数金额；
- 钱包地址格式是否正确；
- 交易状态是否合法。

### 3.4 数据清洗
系统可以：

- 删除重复交易；
- 删除关键字段缺失的记录；
- 标准化时间字段；
- 标准化金额字段；
- 添加 cleaned_flag；
- 添加 cleaning_notes；
- 生成清洗报告。

输出文件：
```
Data/clean_transactions.csv
```
当前示例结果：
```
Original Rows: 556
Duplicate Removed: 0
Missing Value Removed: 0
Modified Rows: 0
Clean Rows: 556
```
当前示例数据本身没有异常，因此清洗前后均为 556 行。

### 3.5 Wallet Aggregation
系统已经能够将交易级数据转换为钱包级用户画像。

转换前：
```text
一行 = 一笔交易
```
转换后：
```text
一行 = 一个钱包用户
```
当前用户画像字段：
```text
wallet_address
transaction_count
total_volume_usd
avg_transaction_amount
active_days
first_transaction_time
last_transaction_time
action_types
```
输出文件：
```text
Data/wallet_profile.csv
```
当前示例数据：
```text
556 条交易
→ 100 个钱包用户
```

### 3.6 Growth Metrics

当前已经实现以下增长指标：

| 指标                   | 含义             |
| -------------------- | -------------- |
| `total_users`        | 独立钱包用户数        |
| `total_transactions` | 总交易次数          |
| `total_volume_usd`   | 总交易金额          |
| `active_users`       | 交易次数不少于 3 次的用户 |
| `repeat_users`       | 完成超过一次交互的用户    |
| `repeat_rate`        | 重复交互用户占比       |

当前示例结果：
```
{
  "total_users": 100,
  "total_transactions": 556,
  "total_volume_usd": 222322.39,
  "active_users": 64,
  "repeat_users": 86,
  "repeat_rate": 0.86
}
```

### 3.7 User Segmentation
当前使用规则式用户分层，不使用机器学习。
已实现四类用户：
| 用户分层            | 当前规则                          |
| --------------- | ----------------------------- |
| High Value User | 总交易金额位于前 20%                  |
| Active User     | 交易次数不少于 3 次                   |
| New User        | 当前未进入其他主要分层的低交互用户             |
| At Risk User    | 有重复交易历史，但距离数据中的最近日期超过 30 天未交互 |

分层优先级：
```text
High Value User
→ At Risk User
→ Active User
→ New User
```

当前示例结果：
```text
High Value User: 20
Active User: 44
New User: 28
At Risk User: 8
```

总用户数：
```text
20 + 44 + 28 + 8 = 100
```

### 3.8 API 完整集成

POST /api/analyze 已经串联：
```text
CSV Upload
→ Validation
→ Cleaning
→ Wallet Aggregation
→ Metrics
→ Segmentation
```

API 返回内容包括：

- 上传文件信息；
- 数据校验结果；
- 数据清洗报告；
- 输出文件路径；
- Growth Metrics；
- User Segmentation；
- 钱包画像预览。

## 3.9 Frontend Demo

已完成基础前端 Dashboard。

当前前端技术：
```
HTML
CSS
JavaScript
```

当前页面支持：

- 选择 CSV 文件；
- 点击 Analyze Data；
- 调用 FastAPI /api/analyze；
- 显示请求状态；
- 展示 Data Quality；
- 展示 Growth Metrics；
- 展示 User Segmentation；
- 展示 Wallet Preview。

当前前端暂未使用：

- Next.js；
- TypeScript；
- Recharts；
- wagmi；
- viem。

这些技术将在后续正式产品版本中逐步接入。

## 4. Demo v0.1 当前能力

Demo v0.1 可以完成：

1.上传标准链上交易 CSV；
2.检查数据质量；
3.清洗交易数据；
4.生成 clean_transactions.csv；
5.将交易记录聚合为钱包用户画像；
6.生成 wallet_profile.csv；
7.计算基础增长指标；
8.对钱包用户进行规则式分层；
9.通过 Web Dashboard 展示分析结果。

总结：
> **Monad Growth Intelligence Demo v0.1 是一个可以上传链上交易数据，并自动完成数据校验、数据清洗、钱包级用户画像、增长指标分析和用户分层的 Web3 用户增长分析原型。**

## 5. 当前运行结果

使用：
```
sample_onchain_transactions.csv
```

当前运行结果：
```text
Original Records: 556
Clean Records: 556
Total Users: 100
Total Transactions: 556
Total Volume: $222,322.39
Active Users: 64
Repeat Users: 86
Repeat Rate: 86%
```

用户分层：
```text
High Value User: 20
Active User: 44
New User: 28
At Risk User: 8
```

## 6. 当前限制

Demo v0.1 目前存在以下限制：

- 使用 Demo 合成数据，不代表真实 Monad 项目经营结果；
- 当前仅支持标准 CSV；
- 用户分层采用固定规则；
- New User 当前属于简化定义；
- 活跃用户采用交易次数阈值，而不是真实 DAU 或 WAU；
- Repeat Rate 表示重复交互率，不等同于严格的 Cohort Retention；
- 后端输出路径目前适合本地 Demo；
- 尚未接入真实 Monad 合约事件；
- 尚未生成 AI 运营策略；
- 尚未将报告哈希写入 Monad；
- 前端尚未部署到公开网络。

## 7. 后续开发计划
### Demo v0.2
计划增加：

- 统一项目相对路径；
- 改进错误处理；
- 完善用户分层定义；
- 增加用户分层解释；
- 增加简单图表；
- 增加本地规则式运营建议；
- 完善 README 和 Demo 截图。

### 后续完整版本
计划增加：

- Next.js；
- TypeScript；
- Tailwind CSS；
- Recharts；
- AI Growth Insight；
- MetaMask 钱包连接；
- wagmi 和 viem；
- Monad AnalysisRegistry 合约；
- Dataset Hash；
- Report Hash；
- 链上报告验证。

## 8. Demo v0.1 结论
当前 Demo v0.1 已经完成最小产品闭环：

```text
链上交易数据
→ 数据质量检查
→ 数据清洗
→ 钱包级用户画像
→ 增长指标
→ 用户分层
→ 前端展示
```
