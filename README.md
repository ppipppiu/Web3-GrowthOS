# Web3-GrowthOS

## 项目概述

Web3-GrowthOS （中文名：**面向Monad生态DApp的链上增长智能分析平台**） 是一个面向 Web3 项目的用户增长智能分析平台，旨在帮助 Web3
项目通过链上数据分析、用户行为洞察以及 AI Agent
生成增长策略，实现用户增长运营的智能化。

传统 Web3
项目通常拥有大量链上交易数据，但缺少对用户行为、用户价值以及增长策略的系统分析能力。本项目通过连接链上数据或上传用户交易数据，对用户进行数据清洗、行为分析、用户分层，并结合
AI Agent 自动生成针对性的增长运营建议。

项目核心流程：

    数据接入
        ↓
    数据清洗与校验
        ↓
    链上用户行为分析
        ↓
    用户价值分层
        ↓
    增长指标可视化
        ↓
    AI Growth Strategy 自动生成

------------------------------------------------------------------------

## 项目功能

### 1. 钱包身份连接

-   支持 Web3 Wallet 登录
-   通过钱包地址作为用户身份标识
-   展示钱包基础信息
-   支持链上交互记录关联

------------------------------------------------------------------------

### 2. 链上数据上传与分析

支持用户上传链上交易数据：

-   CSV 文件
-   XLSX 文件

系统自动完成：

-   数据格式校验
-   异常数据检测
-   数据清洗
-   用户行为聚合

------------------------------------------------------------------------

### 3. 用户增长数据分析

平台提供多维度增长分析：

#### 用户活跃分析

分析：

-   用户交易次数
-   用户活跃周期
-   用户参与程度

#### 用户价值分析

基于链上行为计算：

-   交易频率
-   交易金额
-   用户贡献价值

#### 用户分层分析

根据用户行为划分：

-   高价值用户
-   潜力用户
-   普通用户
-   风险用户

帮助项目方识别：

-   核心用户群体
-   用户流失风险
-   增长机会

------------------------------------------------------------------------

### 4. 增长策略 AI Agent

项目集成 AI Agent，通过本地部署的大语言模型生成增长建议。

当前使用：

-   Ollama
-   Qwen2.5-7B

AI Agent 根据：

-   用户分析结果
-   用户分层结果
-   增长指标

自动生成：

-   用户运营策略
-   用户召回建议
-   用户激励方案
-   增长优化方向

------------------------------------------------------------------------

## 技术架构

    Frontend
    React + Vite
            |
            |
    Backend API
    FastAPI
            |
            |
    Data Processing
    Python
            |
            |
    AI Agent
    Ollama + Qwen2.5-7B
            |
            |
    Blockchain Data
    Wallet / Transaction Data

------------------------------------------------------------------------

## 技术栈

### Frontend

-   React
-   Vite
-   JavaScript
-   CSS
-   Chart Visualization

### Backend

-   Python
-   FastAPI
-   Pandas
-   Data Processing Pipeline

### Web3

-   Wallet Connection
-   Blockchain Transaction Data Analysis

### AI

-   Ollama
-   Qwen2.5-7B
-   AI Growth Strategy Generation

------------------------------------------------------------------------

## 项目结构

    Web3-GrowthOS
    │
    ├── frontend
    │   ├── src
    │   └── React 前端页面
    │
    ├── backend
    │   ├── app
    │   ├── services
    │   └── API 服务
    │
    ├── contracts
    │   └── Solidity 合约
    │
    ├── Data
    │   └── Sample blockchain datasets
    │
    └── README.md

------------------------------------------------------------------------

## 本地运行

### 1. Backend

进入项目目录：

``` bash
cd Web3-GrowthOS
```

创建 Python 环境：

``` bash
python -m venv .venv
```

安装依赖：

``` bash
pip install -r requirements.txt
```

启动 FastAPI：

``` bash
uvicorn backend.app.main:app --reload
```

默认地址：

    http://localhost:8000

------------------------------------------------------------------------

### 2. Frontend

进入前端目录：

``` bash
cd frontend
```

安装依赖：

``` bash
npm install
```

启动：

``` bash
npm run dev
```

访问：

    http://localhost:5173

------------------------------------------------------------------------

### 3. AI Agent

启动 Ollama：

``` bash
ollama serve
```

运行模型：

``` bash
ollama run qwen2.5:7b
```

Backend 会调用 Ollama API 完成 AI Growth Strategy 生成。

------------------------------------------------------------------------

## Demo 使用流程

1.  连接 Web3 钱包
2.  上传链上交易数据
3.  系统完成数据清洗和分析
4.  查看用户增长 Dashboard
5.  查看用户分层结果
6.  使用 AI Agent 生成增长策略

------------------------------------------------------------------------

## 项目亮点

### Web3 + Growth Analytics

结合：

-   链上用户行为
-   用户价值分析
-   增长运营方法

帮助 Web3 项目建立数据驱动增长体系。

### AI Agent 增长助手

利用大语言模型：

-   自动分析用户行为
-   生成运营策略
-   降低增长分析门槛

### 从数据到策略闭环

实现：

    On-chain Data
          ↓
    Analytics
          ↓
    Segmentation
          ↓
    AI Strategy
          ↓
    Growth Optimization

------------------------------------------------------------------------

## Future Improvements

未来计划：

-   支持更多链上数据源
-   增加实时链上数据监听
-   引入更精准用户价值模型
-   优化 AI Agent 多轮策略分析能力
-   支持智能合约自动化运营

------------------------------------------------------------------------

## License

MIT License
