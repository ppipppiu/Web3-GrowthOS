# Web3-GrowthOS  
# 面向 Monad 生态 DApp 的链上增长智能分析平台


## 项目概述

Web3-GrowthOS 是一个面向 Monad 生态 DApp 的链上增长智能分析平台。

在 Web3 生态中，DApp 项目通常拥有大量链上交易数据，但缺少有效的方法理解用户行为、识别高价值用户，并进一步制定用户增长策略。

本项目通过分析链上交易数据，对用户行为、用户价值以及增长机会进行智能分析，并结合 AI Agent 自动生成增长策略建议，帮助 Monad 生态项目实现数据驱动的用户增长运营。


项目核心目标：

- 通过链上数据理解用户行为
- 识别高价值用户和潜力用户
- 发现用户增长问题
- 使用 AI 自动生成增长策略


---

# 项目整体流程


```
链上交易数据

        ↓

数据校验与清洗

        ↓

用户链上行为分析

        ↓

用户价值分层

        ↓

增长分析 Dashboard

        ↓

AI 增长策略生成

        ↓

用户增长优化
```


---

# 核心功能


## 1. 链上数据上传与分析


用户可以上传链上交易数据：

支持：

- CSV
- XLSX


系统自动完成：

- 数据格式校验
- 异常数据检测
- 数据清洗
- 用户行为聚合
- 增长指标计算


数据处理流程：

```
原始链上交易数据

        ↓

数据校验

        ↓

数据清洗

        ↓

用户行为聚合

        ↓

增长指标计算
```


---

# 2. 链上用户行为分析


平台针对 Web3 用户链上行为进行多维度分析。


主要分析指标：

- 钱包活跃情况
- 交易次数
- 交易金额
- 用户参与周期
- 用户交互频率


帮助项目方理解：

- 用户增长趋势
- 用户活跃变化
- 用户参与质量


---

# 3. 用户价值分层


平台根据用户链上行为，对用户进行价值划分。


用户主要分为：


| 用户类型 | 描述 |
| --- | --- |
| 高价值用户 | 高活跃、高贡献用户 |
| 潜力用户 | 具有进一步增长潜力用户 |
| 普通用户 | 基础参与用户 |
| 风险用户 | 低活跃或异常行为用户 |


用户价值分层帮助项目方：

- 识别核心用户
- 优化运营资源分配
- 制定精准用户激励策略


---

# 4. 增长分析 Dashboard


平台提供可视化增长分析能力。


## 用户增长趋势分析

展示：

- 用户增长变化
- 交易趋势
- 用户活跃趋势


---

## 用户增长漏斗分析


分析用户转化路径：

```
钱包用户

      ↓

首次链上交易用户

      ↓

重复交易用户

      ↓

高价值用户
```


帮助项目方发现：

- 用户流失节点
- 转化瓶颈
- 增长机会


---

## 用户价值分布分析


展示：

- 不同价值用户占比
- 用户贡献结构


帮助项目方判断：

- 当前用户质量
- 核心用户规模


---

## Sybil 风险检测


分析异常钱包行为：

- 高频异常交易
- 相似交互模式
- 潜在机器人用户


帮助项目识别：

- 空投攻击风险
- 虚假用户增长


---

# 5. AI Growth Strategy Agent


平台集成 AI Agent，实现自动化增长分析。


AI Agent 基于：

- 用户行为分析结果
- 用户价值分层结果
- 增长指标数据


自动生成：

- 用户运营建议
- 用户召回策略
- 用户激励方案
- 增长优化方向


AI 工作流程：

```
用户分析结果

        ↓

AI Agent 智能理解

        ↓

增长问题分析

        ↓

生成增长策略
```


当前使用模型：

```
Ollama

      ↓

Qwen2.5-7B
```


---

# 技术架构


```
                 用户

                  |

                  |

            React 前端

                  |

                  |

             FastAPI 后端

                  |

        ---------------------

        |                   |

  链上数据分析        AI Agent

        |                   |

 用户行为建模        Ollama

 用户价值分层        Qwen2.5-7B

```


---

# 技术栈


## 前端

- React
- Vite
- JavaScript
- CSS
- 数据可视化组件


## 后端

- Python
- FastAPI
- Pandas
- NumPy


## Web3

- Wallet Connection
- Monad Testnet
- 链上交易数据分析
- Solidity Smart Contract


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

│   └── React 前端应用


├── backend

│   ├── app

│   ├── services

│   └── FastAPI 后端服务


├── contracts

│   └── Solidity 智能合约


├── Data

│   └── 示例链上交易数据


└── README.md
```


---

# 本地运行方式


## 1. 启动后端


进入项目：

```bash
cd Web3-GrowthOS
```


安装依赖：

```bash
pip install -r requirements.txt
```


启动 FastAPI：

```bash
uvicorn backend.app.main:app --reload
```


默认地址：

```
http://localhost:8000
```


API 文档：

```
http://localhost:8000/docs
```


---

## 2. 启动前端


进入：

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

## 3. 启动 AI Agent


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

# 公网 Demo 部署方式


当前 Demo 采用前后端分离部署。


架构：

```
Vercel 前端

        ↓ HTTPS

Cloudflare Tunnel

        ↓

本地 FastAPI 后端

        ↓

Ollama Qwen2.5-7B
```


## 前端部署

部署平台：

- Vercel


Demo 地址：

```
https://web3-growth-os-hatb.vercel.app
```


## 后端公网访问


启动 FastAPI：

```bash
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000
```


启动 Cloudflare Tunnel：

```bash
cloudflared tunnel --url http://localhost:8000
```


---

# Demo 使用流程


```
1. 连接 Web3 钱包

        ↓

2. 上传链上交易数据

        ↓

3. 数据清洗与分析

        ↓

4. 查看增长分析 Dashboard

        ↓

5. 用户价值分层

        ↓

6. AI Agent 生成增长策略

        ↓

7. 查看分析报告
```


---

# Demo 运行环境


需要：

- Node.js >= 18
- Python >= 3.10
- Ollama
- Qwen2.5-7B


---

# 项目亮点


## 链上数据驱动增长分析

结合：

- Blockchain Data
- User Behavior Analytics
- Growth Operation Methodology


建立 Web3 项目的用户增长分析体系。


---

## AI 驱动增长策略生成


通过大语言模型：

- 理解用户行为
- 分析增长问题
- 自动生成运营策略


降低 Web3 项目增长分析门槛。


---

## Data-to-Strategy Pipeline


```
链上数据

      ↓

用户分析

      ↓

用户分层

      ↓

AI 策略生成

      ↓

增长优化
```


---

# Future Improvements


未来计划：

- 支持更多区块链数据源
- 接入实时链上数据
- 优化用户价值模型
- 增强 AI Agent 多轮分析能力
- 支持自动化增长运营


---

# License


MIT License
