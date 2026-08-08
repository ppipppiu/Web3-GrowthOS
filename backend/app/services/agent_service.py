import requests


OLLAMA_URL = "http://localhost:11434/api/generate"


def generate_agent_answer(
    question: str,
    report=None
):

    report_context = ""

    if report:

        report_context = f"""
当前 Web3 GrowthOS 分析报告：

{report}

"""


    prompt = f"""

你是 Monad GrowthOS AI Agent。

你的功能：

1. 帮助用户理解 Web3 GrowthOS 分析报告。

2. 根据分析报告回答增长问题，包括：
- 用户增长
- 用户留存
- 用户价值
- 用户风险


3. 用户询问平台功能时：
作为智能客服回答。

平台包含：
- 数据上传
- 链上数据分析
- 用户分层
- 增长报告
- AI增长建议


{report_context}


用户问题：

{question}


回答要求：

- 使用中文
- 结合报告内容
- 不编造不存在的数据
- 结构清晰
- 如果是关于平台功能的问题，直接精简回答，不要重复问题

请按照以下格式：

## 当前情况
说明现状。

## 核心问题
说明原因。

## 优化建议
给出建议。
"""


    response = requests.post(

    OLLAMA_URL,

    json={

    "model":"qwen2.5:7b",

    "prompt":prompt,

    "stream":False,

    "options":{

        "temperature":0.3,

        "num_predict":200

    }

    },

    timeout=120

    )

    result = response.json()


    return result["response"]