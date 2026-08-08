import json
import requests


# ==========================
# Ollama 配置
# ==========================

OLLAMA_URL = "http://localhost:11434/api/generate"

# 如果你安装的是其他模型，只需要修改这里
MODEL = "qwen2.5:7b"


# ==========================
# 不同分析类型 Prompt
# ==========================

SYSTEM_PROMPTS = {

    "activation": """
你是一名 Web3 用户激活与新用户转化专家。

你的任务是根据目标用户 Segment 的链上行为画像，
分析用户从钱包连接、首次交易到持续交易过程中的激活状态，
并给出针对性的用户运营策略。

重点关注：
1. 钱包连接与首次交互
2. 首次交易转化
3. 二次交易与持续参与
4. 交易门槛和用户教育
5. 新用户任务与激励设计
6. 激活率提升
""",

    "value": """
你是一名 Web3 用户增长与用户价值运营专家。

你的任务是根据目标用户 Segment 的链上行为画像，
分析该用户群体的价值特征，并给出针对性的用户运营策略。

重点关注：
1. 用户价值贡献
2. 交易活跃度
3. 用户成长潜力
4. 长期价值提升
5. 用户激励和运营策略
""",

    "growth": """
你是一名 Web3 用户增长分析专家。

你的任务是根据项目当前的用户增长数据，
判断增长状态、识别增长瓶颈，并提出具体增长策略。

重点关注：
1. 用户规模变化
2. 新增用户
3. 活跃用户
4. 用户激活情况
5. 增长瓶颈
6. 新用户转化和增长机会
""",

    "retention": """
你是一名 Web3 用户留存与生命周期运营专家。

你的任务是根据用户持续参与和链上活跃数据，
分析用户留存情况、流失风险和生命周期问题。

重点关注：
1. 用户持续交互
2. 活跃周期
3. 重复交易
4. 沉默和流失用户
5. 留存提升策略
6. 二次交互和长期参与
""",

    "sybil": """
你是一名 Web3 链上风险与 Sybil 行为分析专家。

你的任务是根据钱包行为数据，
分析潜在异常钱包和 Sybil 风险。

重点关注：
1. 异常交易频率
2. 行为模式相似性
3. 钱包交互特征
4. 潜在批量钱包行为
5. 风险等级
6. 风险控制建议

注意：
只能根据提供的数据进行风险分析，
不要把风险信号直接描述成已经确认的攻击行为。
"""

}


# ==========================
# 生成 Prompt
# ==========================

def build_prompt(
    analysis_type,
    profile
):

    system_prompt = SYSTEM_PROMPTS.get(
        analysis_type,
        SYSTEM_PROMPTS["growth"]
    )


    profile_json = json.dumps(
        profile,
        ensure_ascii=False,
        indent=2,
        default=str
    )


    prompt = f"""
{system_prompt}

以下是 GrowthOS 根据当前链上数据计算出的分析画像：

{profile_json}


请根据以上真实数据生成分析结果。

请严格使用以下中文结构：

【分析总结】
用 2-3 句话概括当前用户群体或项目状态。

【核心特征】
- 特征1
- 特征2
- 特征3

【主要问题或机会】
- 问题或机会1
- 问题或机会2
- 问题或机会3

【策略建议】
1. 策略1
2. 策略2
3. 策略3

要求：

1. 所有结论必须基于提供的数据。
2. 不要虚构不存在的指标。
3. 不要输出代码。
4. 不要解释你是 AI。
5. 策略需要具体、可执行。
6. 使用中文。
7. 适用于 Web3 项目用户增长场景。
"""


    return prompt


# ==========================
# 统一 AI Strategy Engine
# ==========================

def generate_strategy(
    profile,
    analysis_type="value"
):

    if not profile:

        raise ValueError(
            "Profile data is empty"
        )


    prompt = build_prompt(
        analysis_type,
        profile
    )


    response = requests.post(

        OLLAMA_URL,

        json={

            "model":
            MODEL,

            "prompt":
            prompt,

            "stream":
            False,

            "options": {

                "temperature":
                0.4

            }

        },

        timeout=120

    )


    response.raise_for_status()


    result = response.json()


    strategy = result.get(
        "response",
        ""
    )


    if not strategy:

        raise ValueError(
            "Ollama returned empty response"
        )


    return strategy