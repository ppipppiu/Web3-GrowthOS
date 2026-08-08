# Web3-GrowthOS

## 项目概述

Web3-GrowthOS 是一个面向 Web3 项目的链上用户增长智能分析平台。

在 Web3 生态中，项目方通常拥有大量链上交易数据，但缺少有效的方法对用户行为、用户价值以及增长机会进行分析。本项目通过连接或上传链上交易数据，对用户进行行为分析、价值分层，并结合 AI Agent 自动生成增长策略建议，帮助 Web3 项目实现数据驱动的用户增长运营。

项目核心流程：

```
Blockchain Transaction Data

        ↓

Data Validation & Cleaning

        ↓

On-chain User Behavior Analysis

        ↓

User Value Segmentation

        ↓

Growth Dashboard Visualization

        ↓

AI Growth Strategy Generation
```

---

# 项目功能

## 1. Web3 Wallet Connection

平台支持 Web3 Wallet 连接。

钱包地址作为用户身份标识，用于：

- 用户身份识别
- 链上行为关联
- 分析报告绑定

---

# 2. 链上数据上传与分析

用户可以上传链上交易数据：

支持：

- CSV
- XLSX


系统自动完成：

- 数据格式校验
- 异常数据检测
- 数据清洗
- 用户行为聚合


数据处理流程：

```
Raw Transaction Data

        ↓

Validation

        ↓

Cleaning

        ↓

Aggregation

        ↓

Growth Metrics
```

---

# 3. Web3 User Growth Analytics

平台提供多维度用户增长分析。

## User Activity Analysis

分析：

- 用户交易次数
- 用户活跃周期
- 用户参与程度


帮助项目方了解：

- 用户规模变化
- 用户活跃趋势
- 用户参与质量


---

## User Value Analysis

基于链上行为计算用户价值。

分析指标：

- Transaction Frequency
- Transaction Volume
- User Contribution


用于识别：

- 核心用户
- 潜力用户
- 普通用户


---

## User Segmentation

平台根据用户链上行为进行用户分层。

主要用户类型：

| 用户类型 | 描述 |
| --- | --- |
| High Value User | 高活跃、高贡献用户 |
| Potential User | 具有增长潜力用户 |
| Normal User | 普通参与用户 |
| Risk User | 低活跃或异常行为用户 |


用户分层帮助项目方：

- 优先运营高价值用户
- 发现增长机会
- 优化用户激励策略


---

# 4. Growth Dashboard

平台提供可视化增长分析 Dashboard。

主要模块：

## User Growth Trend

展示：

- 用户增长趋势
- 交易趋势
- 用户活跃变化


## User Growth Funnel

分析用户转化路径：

```
Wallet User

      ↓

First Transaction

      ↓

Repeated Transaction

      ↓

High Value User
```


## User Value Distribution

展示：

- 不同价值用户比例
- 用户贡献结构


## Sybil Risk Detection

分析异常钱包行为：

- 异常交易模式
- 疑似机器人行为
- 风险用户识别


---

# 5. AI Growth Strategy Agent

平台集成 AI Agent，为用户提供智能增长分析。

AI Agent 基于：

- 用户行为分析结果
- 用户价值分层结果
- 增长指标数据


自动生成：

- 用户运营建议
- 用户召回策略
- 用户激励方案
- 增长优化方向


当前 AI 模型：

```
Ollama

      ↓

Qwen2.5-7B
```


AI 调用流程：

```
Growth Analysis Result

        ↓

AI Agent

        ↓

Growth Strategy
```

---

# 技术架构


```
                Frontend

            React + Vite

                  |

                  |

              FastAPI API

                  |

                  |

          Python Data Pipeline

                  |

        --------------------

        |                  |

 Blockchain Data      AI Agent

 Wallet Data          Ollama

                      Qwen2.5-7B

```


---

# 技术栈


## Frontend

- React
- Vite
- JavaScript
- CSS
- Chart Visualization


## Backend

- Python
- FastAPI
- Pandas
- NumPy


## Web3

- Wallet Connection
- Blockchain Transaction Data Analysis
- Smart Contract Integration


## AI

- Ollama
- Qwen2.5-7B
- AI Agent


---

# 项目结构


```
Web3-GrowthOS

│

├── frontend

│   ├── src

│   └── React Frontend Application


├── backend

│   ├── app

│   ├── services

│   └── FastAPI Backend


├── contracts

│   └── Solidity Smart Contracts


├── Data

│   └── Sample Blockchain Dataset


└── README.md
```

---

# 本地运行方式


## 1. Backend


进入项目目录：

```bash
cd Web3-GrowthOS
```


创建环境：

```bash
python -m venv .venv
```


安装依赖：

```bash
pip install -r requirements.txt
```


启动 FastAPI：

```bash
uvicorn backend.app.main:app --reload
```


默认：

```
http://localhost:8000
```


API 文档：

```
http://localhost:8000/docs
```


---

## 2. Frontend


进入 frontend：

```bash
cd frontend
```


安装依赖：

```bash
npm install
```


启动：

```bash
npm run dev
```


默认：

```
http://localhost:5173
```


---

## 3. AI Agent


安装 Ollama：

https://ollama.com/


下载模型：

```bash
ollama pull qwen2.5:7b
```


启动：

```bash
ollama serve
```


运行模型：

```bash
ollama run qwen2.5:7b
```


---

# 公网 Demo 部署


当前 Demo 使用：

```
Frontend

Vercel

        ↓ HTTPS

Cloudflare Tunnel

        ↓

Local FastAPI Backend

        ↓

Ollama Qwen2.5-7B
```


## Frontend Deployment

部署平台：

- Vercel


Demo 地址：

```
https://web3-growth-os-hatb.vercel.app
```


## Backend Deployment

当前采用：

- FastAPI 本地运行
- Cloudflare Tunnel 暴露公网 API


启动：

```bash
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```


启动 Tunnel：

```bash
cloudflared tunnel --url http://localhost:8000
```


---

# Demo 使用流程


完整流程：

```
1. Connect Wallet

        ↓

2. Upload Blockchain Transaction Data

        ↓

3. Data Cleaning & Analysis

        ↓

4. Growth Dashboard

        ↓

5. User Segmentation

        ↓

6. AI Agent Strategy Generation

        ↓

7. View Analysis Report
```


---

# Demo Requirements


运行 Demo 需要：

- Node.js >= 18
- Python >= 3.10
- Ollama
- Qwen2.5-7B


---

# 项目亮点


## Web3 + Growth Analytics

结合：

- 链上用户行为
- 用户价值分析
- 增长运营方法

建立 Web3 项目的数据驱动增长体系。


---

## AI Agent Growth Assistant

通过大语言模型：

- 理解用户分析结果
- 自动生成增长策略
- 降低 Web3 增长分析门槛


---

## Data-to-Strategy Pipeline


```
On-chain Data

      ↓

Analytics

      ↓

Segmentation

      ↓

AI Strategy

      ↓

Growth Optimization
```


---

# Future Improvements


未来计划：

- 支持更多区块链数据源
- 增加实时链上数据监听
- 优化用户价值模型
- 提升 AI Agent 多轮分析能力
- 支持自动化增长运营


---

# License


MIT License
