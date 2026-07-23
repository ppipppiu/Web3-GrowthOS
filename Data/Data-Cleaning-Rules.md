# Web3 GrowthOS Mini Demo v0.1 - Data Cleaning Rules

## 1. 文档目的
本文档定义 Web3 GrowthOS Mini Demo v0.1 中链上交易数据的清洗规则。
数据处理流程：

```text
CSV Upload
↓
Data Validation
↓
Data Cleaning
↓
Clean Transaction Dataset
↓
Growth Metrics Analysis
```


数据校验阶段负责发现问题：

- 缺失字段
- 空值
- 重复交易
- 非法格式

数据清洗阶段负责处理问题：

- 删除无法使用的数据
- 修正可以恢复的数据格式
- 保留仍具有分析价值的数据

---

# 2. 清洗原则

## 2.1 删除原则

满足以下情况的数据进行删除：

1. 无法确定真实业务含义；
2. 无法参与后续用户分析；
3. 会直接影响核心指标计算；
4. 无法通过规则恢复。

例如：

- 无钱包地址；
- 无交易哈希；
- 无交易金额。

---

## 2.2 修正原则

满足以下情况的数据进行修正：

1. 数据内容本身正确；
2. 只是格式不统一；
3. 可以通过确定规则恢复。

例如：

- 字符串数字转换为数值；
- 时间格式统一。

---

## 2.3 保留原则

对于非核心字段：

如果异常不会影响主要分析结果，则保留。

例如：

- token_symbol 缺失；
- gas_fee_usd 缺失。

---

# 3. 字段级清洗规则

## 3.1 wallet_address

### 作用

钱包地址用于识别链上用户，是用户分析的核心字段。

### 清洗规则

|异常情况|处理方式|原因|
|-|-|-|
|字段为空|删除记录|无法识别用户|
|地址格式错误|删除记录|无法关联钱包行为|
|大小写不同|保留|EVM地址可能存在checksum|

### 合法格式
```text
0x + 40位hex字符
```

示例：
```text
0x1234567890abcdef1234567890abcdef12345678
```

---

# 3.2 transaction_hash

### 作用

交易哈希用于唯一识别链上交易。

### 清洗规则

|异常情况|处理方式|原因|
|-|-|-|
|字段为空|删除记录|无法唯一定位交易|
|格式错误|删除记录|无法确认交易|
|重复hash|删除重复记录，保留第一条|避免重复统计交易|

---

# 3.3 block_time

### 作用

交易时间用于：

- 新钱包识别；
- 活跃用户分析；
- 流失风险判断。

### 清洗规则

|异常情况|处理方式|原因|
|-|-|-|
|无法解析时间|删除记录|无法进行时间分析|
|时间格式不统一|统一格式|保证分析一致性|

目标格式：
```
YYYY-MM-DD HH:MM:SS
```
---

# 3.4 amount_usd
### 作用

交易金额用于：
- 用户价值计算；
- 交易规模分析；
- 高价值钱包识别。

### 清洗规则
|异常情况|处理方式|原因|
|-|-|-|
|为空|删除记录|无法计算交易价值|
|字符串数字|转换为float|格式问题，可以恢复|
|非数字字符|删除记录|无法计算金额|
|负数|删除记录|交易金额不应为负|
|0金额|删除记录|无有效交易价值|

目标类型：
```
float
```

---

# 3.5 action_type
### 作用
表示交易行为类型。
当前 Demo 支持：
```
swap
add_liquidity
remove_liquidity
```

### 清洗规则

|异常情况|处理方式|原因|
|-|-|-|
|为空|删除记录|无法判断行为|
|未知类型|删除记录|当前分析范围不支持|

---

# 3.6 token_symbol

### 作用

表示交易涉及Token。

### 清洗规则

|异常情况|处理方式|原因|
|-|-|-|
|为空|保留|不是核心分析字段|

处理方式：

可填充：
```
unknow
```

---

# 3.7 gas_fee_usd

### 作用
表示交易成本。

### 清洗规则
|异常情况|处理方式|原因|
|-|-|-|
|为空|保留|不影响主要用户分析|
|无法转换数字|置为空值|避免影响计算|
|负数|置为空值|交易成本不应为负|

---

# 3.8 transaction_status

### 作用
表示交易执行状态。
当前支持：
```
success
failed
```

### 清洗规则
|异常情况|处理方式|原因|
|-|-|-|
|为空|删除记录|无法判断交易有效性|
|非法状态|删除记录|无法分类交易结果|

---

# 4. 清洗处理优先级
清洗按照以下顺序执行：
```text
删除完全无效记录
 ↓
删除关键字段缺失记录
 ↓
删除重复交易
 ↓
修正数据格式
 ↓
输出clean dataset
```

# 5. 清洗输出数据结构
清洗后保持原始字段：
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

增加清洗记录字段：
|字段|作用|
|-|-|
|cleaned_flag|记录是否经过处理|
|cleaning_notes|记录处理原因|

最终：
```
wallet_address
transaction_hash
block_time
action_type
amount_usd
token_symbol
gas_fee_usd
transaction_status
cleaned_flag
cleaning_notes
```

# 6. 清洗报告输出格式

清洗完成后返回：

```
json
{
    "cleaning_summary": {
        "original_rows": 556,
        "clean_rows": 548,
        "removed_rows": 8,
        "modified_rows": 12
    },

    "cleaning_actions": {
        "duplicate_transactions_removed": 3,
        "invalid_wallet_removed": 2,
        "invalid_time_removed": 1,
        "invalid_amount_removed": 1,
        "invalid_status_removed": 1
    }
}
```

## 7. 当前版本限制

Mini Demo v0.1:
使用模拟链上交易数据；
- 仅支持 EVM 风格钱包地址；
- 仅支持 DEX 交易行为；
- 不接入真实 RPC 数据；
- 不处理复杂链上事件解析。

后续版本可以扩展：
- 多链钱包格式；
- Token价格校正；
- 链上事件解析；
- RPC实时数据接入。

