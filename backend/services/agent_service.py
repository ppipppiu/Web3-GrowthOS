import json
from typing import Iterable, Optional

import requests


OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "qwen2.5:7b"


OUT_OF_SCOPE_MESSAGE = (
    "Growth Agent 当前仅支持 GrowthOS 平台使用、历史报告分析，以及用户增长、"
    "用户激活、用户留存、用户价值和风险检测相关问题。\n\n"
    "你可以问我例如：‘怎么上传数据？’、‘分析这份报告的用户留存问题’或‘用户价值该怎么优化？’。"
)


# =========================================================
# Agent 业务范围识别
# =========================================================

PLATFORM_KEYWORDS = {
    "growthos",
    "growth os",
    "monad growth",
    "平台",
    "上传",
    "csv",
    "xlsx",
    "钱包",
    "metamask",
    "连接钱包",
    "工作区",
    "报告",
    "历史报告",
    "分析中心",
    "dashboard",
    "看板",
    "agent",
    "链上",
    "上链",
    "交易哈希",
    "txhash",
    "tx hash",
    "monad",
    "数据源",
    "用户分层",
    "segment",
}

BUSINESS_KEYWORDS = {
    "用户增长",
    "增长",
    "新增用户",
    "增长率",
    "留存",
    "retention",
    "用户价值",
    "高价值用户",
    "value",
    "风险",
    "风险检测",
    "sybil",
    "女巫",
    "异常用户",
    "漏斗",
    "funnel",
    "激活",
    "activation",
    "活跃",
    "交易次数",
    "交易量",
    "交易金额",
    "用户画像",
    "运营策略",
    "增长策略",
    "指标",
    "分析",
}

FOLLOW_UP_KEYWORDS = {
    "为什么",
    "继续",
    "详细",
    "具体",
    "优化",
    "建议",
    "原因",
    "问题",
    "那",
    "这个",
    "这些",
    "上面",
    "刚才",
    "它",
}

GREETING_KEYWORDS = {
    "你好",
    "您好",
    "hello",
    "hi",
    "你是谁",
    "你能做什么",
    "谢谢",
    "感谢",
}


MODULE_KEYWORDS = {
    "growth": [
        "用户增长",
        "新增用户",
        "增长趋势",
        "增长率",
        "growth",
    ],
    "activation": [
        "用户激活",
        "激活用户",
        "激活率",
        "首次交易",
        "activation",
    ],
    "retention": [
        "用户留存",
        "留存",
        "retention",
        "回访",
        "回流",
    ],
    "value": [
        "用户价值",
        "高价值用户",
        "价值用户",
        "value",
        "价值分层",
    ],
    "sybil": [
        "风险检测",
        "用户风险",
        "风险用户",
        "sybil",
        "女巫",
        "异常用户",
    ],
}


def _normalize_text(value: str) -> str:
    return (value or "").strip().lower()


def _history_text(messages=None) -> str:
    if not messages:
        return ""

    parts = []

    for item in messages[-8:]:
        if not isinstance(item, dict):
            continue

        content = str(item.get("content", ""))
        if content:
            parts.append(content)

    return "\n".join(parts).lower()


def is_agent_question_in_scope(
    question: str,
    report=None,
    messages=None,
) -> bool:
    """
    Demo 阶段的轻量业务范围识别。

    目标不是做通用意图分类，而是确保 Growth Agent 只回答：
    - GrowthOS 平台使用
    - 当前选定报告的分析
    - 用户增长 / 激活 / 留存 / 价值 / 风险等增长业务问题
    """

    text = _normalize_text(question)

    if not text:
        return False

    if any(keyword in text for keyword in GREETING_KEYWORDS):
        return True

    if any(keyword in text for keyword in PLATFORM_KEYWORDS):
        return True

    if any(keyword in text for keyword in BUSINESS_KEYWORDS):
        return True

    # 已处于报告分析上下文时，允许自然的短追问，例如：
    # “那怎么优化？”、“具体原因呢？”
    if report:
        if any(keyword in text for keyword in FOLLOW_UP_KEYWORDS):
            return True

    history = _history_text(messages)

    history_is_business = any(
        keyword in history
        for keyword in (
            PLATFORM_KEYWORDS
            | BUSINESS_KEYWORDS
        )
    )

    if history_is_business and len(text) <= 40:
        if any(keyword in text for keyword in FOLLOW_UP_KEYWORDS):
            return True

    return False


# =========================================================
# 五类 Analysis Center 模块识别
# =========================================================


def detect_analysis_modules(question: str):
    text = _normalize_text(question)

    # GrowthOS 是平台名称，不能因为其中包含 growth
    # 就误判为“用户增长分析”。
    module_text = (
        text
        .replace("growthos", "")
        .replace("growth os", "")
    )

    modules = []

    for module, keywords in MODULE_KEYWORDS.items():
        matched = False

        for keyword in keywords:
            keyword_text = keyword.lower()

            if keyword_text.isascii():
                import re

                if re.search(
                    rf"(?<![a-z0-9_]){re.escape(keyword_text)}(?![a-z0-9_])",
                    module_text
                ):
                    matched = True
                    break
            elif keyword_text in module_text:
                matched = True
                break

        if matched:
            modules.append(module)

    # 去重，避免同一模块出现多个跳转按钮。
    return list(dict.fromkeys(modules))



# =========================================================
# Prompt 构造
# =========================================================


def _format_history(messages=None) -> str:
    if not messages:
        return "暂无此前对话。"

    lines = []

    for item in messages[-10:]:
        if not isinstance(item, dict):
            continue

        role = item.get("role")
        content = str(item.get("content", "")).strip()

        if not content:
            continue

        # 防止单条消息无限变长。
        content = content[:1200]

        role_name = "用户" if role == "user" else "Agent"
        lines.append(f"{role_name}: {content}")

    return "\n".join(lines) or "暂无此前对话。"


def _format_report(report=None) -> str:
    if not report:
        return (
            "当前没有选择具体历史报告。\n"
            "如果用户要求分析报告数据，请提示用户先在 Agent 中选择一份历史报告，"
            "不要假设或编造任何报告数据。"
        )

    try:
        report_json = json.dumps(
            report,
            ensure_ascii=False,
            indent=2,
        )
    except TypeError:
        report_json = str(report)

    return (
        "当前用户已经明确选择一份 GrowthOS 历史报告。\n"
        "你只能基于下面这份指定报告进行数据判断，不得引用其他历史报告，也不得编造数据。\n\n"
        f"{report_json}"
    )


def _build_prompt(
    question: str,
    report=None,
    messages=None,
) -> str:
    history_context = _format_history(messages)
    report_context = _format_report(report)

    return f"""
你是 Monad GrowthOS 的 Growth Agent。

你的职责范围只有以下三类：
1. GrowthOS 平台使用帮助，例如上传数据、连接钱包、查看报告、分析中心、用户分层等。
2. 对用户当前明确选择的单份 GrowthOS 历史报告进行解释和增长分析。
3. 围绕 GrowthOS 已有四个分析模块回答业务问题：用户增长、用户留存、用户价值、风险检测。

重要约束：
- 不处理与 GrowthOS 平台、增长分析或当前报告无关的话题。
- 如果没有选择具体报告，却要求分析报告数据，必须提示用户先选择历史报告。
- 如果已经选择报告，只能使用该报告提供的信息。
- 不得编造指标、比例、用户数量或结论。
- 对后续追问要结合此前对话理解“这个”“那”“继续”等指代。
- 使用中文。
- 平台使用类问题：直接、简洁、按步骤回答，不要强行套分析模板。
- 报告/增长业务类问题：优先按“当前情况 → 核心问题 → 优化建议”的结构回答。
- 不需要在正文中输出页面 URL；前端会根据问题自动提供 Analysis Center 跳转按钮。

【此前对话】
{history_context}

【当前指定报告】
{report_context}

【用户当前问题】
{question}
"""


# =========================================================
# 非流式兼容接口
# =========================================================


def generate_agent_answer(
    question: str,
    report=None,
    messages=None,
):
    if not is_agent_question_in_scope(
        question,
        report=report,
        messages=messages,
    ):
        return OUT_OF_SCOPE_MESSAGE

    prompt = _build_prompt(
        question,
        report=report,
        messages=messages,
    )

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.3,
                "num_predict": 350,
            },
        },
        timeout=120,
    )

    response.raise_for_status()

    result = response.json()

    return result.get(
        "response",
        "Agent 暂时没有生成有效回答。",
    )


# =========================================================
# 流式输出
# =========================================================


def generate_agent_answer_stream(
    question: str,
    report=None,
    messages=None,
) -> Iterable[str]:
    """
    逐块读取 Ollama /api/generate 的 NDJSON 响应。
    main.py 再将每个文本块包装成前端使用的 NDJSON 事件。
    """

    if not is_agent_question_in_scope(
        question,
        report=report,
        messages=messages,
    ):
        yield OUT_OF_SCOPE_MESSAGE
        return

    prompt = _build_prompt(
        question,
        report=report,
        messages=messages,
    )

    with requests.post(
        OLLAMA_URL,
        json={
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": True,
            "options": {
                "temperature": 0.3,
                "num_predict": 350,
            },
        },
        stream=True,
        timeout=120,
    ) as response:
        response.raise_for_status()

        for raw_line in response.iter_lines(
            decode_unicode=True
        ):
            if not raw_line:
                continue

            try:
                data = json.loads(raw_line)
            except json.JSONDecodeError:
                continue

            if data.get("error"):
                raise RuntimeError(
                    data.get("error")
                )

            chunk = data.get("response", "")

            if chunk:
                yield chunk

            if data.get("done"):
                break
