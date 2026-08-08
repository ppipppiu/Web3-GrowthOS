import io
import json
from io import StringIO
from pydantic import BaseModel
from typing import Optional

import pandas as pd

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Form
)

from fastapi.middleware.cors import (
    CORSMiddleware
)

from fastapi.responses import (
    StreamingResponse
)


# =========================================================
# 原有分析模块
# =========================================================

from backend.services.pipeline import run_pipeline

from backend.analytics.dashboard import (
    calculate_dashboard
)

from backend.analytics.distribution import (
    calculate_distribution
)

from backend.analytics.segment_builder import (
    build_segment
)


# =========================================================
# 新增：统一 Growth Profile Engine
# =========================================================

from backend.analytics.growth_profiles import (
    build_analysis_profile
)


# =========================================================
# 新增：统一 AI Strategy Engine
# =========================================================

from backend.services.ai_strategy import (
    generate_strategy
)
from backend.services.agent_service import (
    generate_agent_answer,
    generate_agent_answer_stream,
    is_agent_question_in_scope,
    detect_analysis_modules,
    OUT_OF_SCOPE_MESSAGE
)

# =========================================================
# 报告相关
# =========================================================

from backend.services.report_storage import (
    save_report,
    get_reports,
    get_profile,
    get_report,
    get_report_indexes,
    delete_report
)



# =========================================================
# FastAPI
# =========================================================

app = FastAPI()



# =========================================================
# 临时分析缓存
#
# 当前 Demo 使用内存缓存。
# 每次重新启动 FastAPI 后缓存会清空，
# 因此重启后需要重新上传数据。
# =========================================================

dashboard_cache = {

    "users": [],

    "transactions": [],

    "value_model": None,

    "segment": None

}



# =========================================================
# CORS
# =========================================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=[
        "*"
    ],

    allow_credentials=True,

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ]

)



# =========================================================
# 健康检查
# =========================================================

@app.get("/")
def home():

    return {

        "message":
        "Web3 GrowthOS API Running"

    }

# =========================================================
# AI Agent Chat API
#
# 兼容两种使用方式：
#
# 1. 旧版 Agent：
#    question + report
#
# 2. 新版 Agent：
#    question + wallet_address + report_id
#
# 新版会根据指定历史报告生成上下文，
# 不会影响原有 /api/analyze、Dashboard、Segment、
# Growth Profile、AI Strategy 等接口。
# =========================================================

class AgentRequest(BaseModel):

    question: str

    # 旧版前端兼容字段
    report: Optional[dict] = None

    # 新版指定历史报告字段
    report_id: Optional[str] = None
    wallet_address: Optional[str] = None

    # 当前会话上下文。
    # Demo 阶段由前端内存维护，不做数据库持久化。
    messages: Optional[list] = None


def _get_report_by_id(
    wallet_address: str,
    report_id: str
):

    """
    根据钱包地址 + report_id 读取指定历史报告。

    完整报告由 backend/services/report_storage.py
    从 backend/reportdata 读取。
    """

    return get_report(
        wallet_address,
        report_id
    )


def _build_value_profile(
    users,
    transactions
):

    """
    Agent 使用的基础用户价值画像。

    当前 Growth Profile Engine 原版主要支持：
    growth / retention / sybil。

    这里单独提供 value 的兼容画像，
    避免为了 Agent 改动原有 Value Segment 流程。
    """

    users_df = pd.DataFrame(
        users or []
    )


    profile = {

        "分析类型":
        "用户价值分析",

        "用户总数":
        int(
            len(users_df)
        )

    }


    if users_df.empty:

        return profile


    # -------------------------------------------------
    # 平均交易价值
    # -------------------------------------------------

    if (
        "total_volume"
        in users_df.columns
    ):

        total_volume = pd.to_numeric(

            users_df[
                "total_volume"
            ],

            errors="coerce"

        ).fillna(0)


        profile[
            "平均交易价值"
        ] = round(

            float(
                total_volume.mean()
            ),

            2

        )


        profile[
            "总交易价值"
        ] = round(

            float(
                total_volume.sum()
            ),

            2

        )


    # -------------------------------------------------
    # 平均交易次数
    # -------------------------------------------------

    if (
        "transaction_count"
        in users_df.columns
    ):

        transaction_count = pd.to_numeric(

            users_df[
                "transaction_count"
            ],

            errors="coerce"

        ).fillna(0)


        profile[
            "平均交易次数"
        ] = round(

            float(
                transaction_count.mean()
            ),

            2

        )


    # -------------------------------------------------
    # 如果 Pipeline 已经输出 value_score
    # -------------------------------------------------

    if (
        "value_score"
        in users_df.columns
    ):

        value_score = pd.to_numeric(

            users_df[
                "value_score"
            ],

            errors="coerce"

        ).fillna(0)


        profile[
            "平均用户价值分"
        ] = round(

            float(
                value_score.mean()
            ),

            2

        )


    # -------------------------------------------------
    # 如果 Pipeline 已经输出 value_level
    # -------------------------------------------------

    if (
        "value_level"
        in users_df.columns
    ):

        value_counts = (

            users_df[
                "value_level"
            ]
            .fillna(
                "未分类"
            )
            .astype(str)
            .value_counts()
            .to_dict()

        )


        profile[
            "价值分层分布"
        ] = {

            str(key):
            int(value)

            for key, value
            in value_counts.items()

        }


    return profile



def _build_activation_profile(
    users,
    transactions
):

    """Agent 使用的用户激活画像，口径与前端 Activation 页面保持一致。"""

    users_df = pd.DataFrame(
        users or []
    )

    total_users = int(
        len(users_df)
    )

    profile = {
        "分析类型": "用户激活分析",
        "用户总数": total_users
    }

    if users_df.empty:
        return profile

    def is_wallet_connected(row):
        explicit_value = None

        for field in [
            "wallet_connected",
            "is_wallet_connected",
            "connected",
            "walletConnected"
        ]:
            if field in row.index:
                value = row.get(field)
                if pd.notna(value):
                    explicit_value = value
                    break

        if explicit_value is not None:
            if isinstance(explicit_value, bool):
                return explicit_value

            normalized = str(explicit_value).strip().lower()

            if normalized in {
                "false", "0", "no", "未连接", "disconnected"
            }:
                return False

            if normalized in {
                "true", "1", "yes", "已连接", "connected"
            }:
                return True

        return bool(row.get("wallet_address"))

    connected_flags = users_df.apply(
        is_wallet_connected,
        axis=1
    )

    if "transaction_count" in users_df.columns:
        transaction_count = pd.to_numeric(
            users_df["transaction_count"],
            errors="coerce"
        ).fillna(0)
    else:
        transaction_count = pd.Series(
            [0] * total_users,
            index=users_df.index
        )

    not_connected = int((~connected_flags).sum())
    connected_no_transaction = int((
        connected_flags & (transaction_count <= 0)
    ).sum())
    first_transaction = int((
        connected_flags & (transaction_count == 1)
    ).sum())
    activated = int((
        connected_flags & (transaction_count >= 2)
    ).sum())

    profile.update({
        "未连接钱包用户数": not_connected,
        "已连接未交易用户数": connected_no_transaction,
        "首次交易用户数": first_transaction,
        "激活用户数": activated,
        "激活用户占比": round(
            activated / total_users * 100,
            2
        ) if total_users else 0
    })

    return profile

def _build_agent_report_context(
    historical_report: dict
):

    """
    将指定历史报告转换为 Agent 使用的结构化上下文。
    """

    if not historical_report:

        return None


    analysis_data = historical_report.get(

        "analysis",

        {}

    )


    users = analysis_data.get(

        "users",

        []

    )


    transactions = analysis_data.get(

        "transactions",

        []

    )


    return {

        "report_id":
        historical_report.get(
            "report_id"
        ),

        "created_at":
        historical_report.get(
            "created_at"
        ),

        "file":
        historical_report.get(
            "file"
        ),

        "analysis_profiles": {

            "用户增长":
            build_analysis_profile(

                "growth",

                users,

                transactions

            ),

            "用户激活":
            _build_activation_profile(

                users,

                transactions

            ),

            "用户留存":
            build_analysis_profile(

                "retention",

                users,

                transactions

            ),

            "用户价值":
            _build_value_profile(

                users,

                transactions

            ),

            "风险检测":
            build_analysis_profile(

                "sybil",

                users,

                transactions

            )

        }

    }


@app.post("/api/agent/chat")
def agent_chat(
    request: AgentRequest
):

    try:

        report_context = None


        # =============================================
        # 新版：
        # 根据 wallet_address + report_id
        # 读取指定历史报告
        # =============================================

        if (
            request.wallet_address
            and
            request.report_id
        ):

            historical_report = (
                _get_report_by_id(

                    request.wallet_address,

                    request.report_id

                )
            )


            if not historical_report:

                return {

                    "success":
                    False,

                    "answer":
                    "未找到你选择的历史报告，请重新选择后再进行分析。",

                    "message":
                    "未找到指定历史报告"

                }


            report_context = (
                _build_agent_report_context(
                    historical_report
                )
            )


        # =============================================
        # 旧版兼容：
        # 如果前端仍然直接传 report，
        # 继续允许 Agent 使用。
        # =============================================

        elif request.report:

            report_context = (
                request.report
            )


        in_scope = is_agent_question_in_scope(

            request.question,

            report=report_context,

            messages=request.messages

        )


        answer = generate_agent_answer(

            request.question,

            report_context,

            request.messages

        )


        return {

            "success":
            True,

            "answer":
            answer,

            "report_id":
            request.report_id,

            "scope":
            "in_scope" if in_scope else "out_of_scope",

            "action_modules":
            detect_analysis_modules(
                request.question
            ) if in_scope else []

        }


    except Exception as e:

        return {

            "success":
            False,

            "answer":
            "Agent 暂时无法完成本次回答，请稍后重试。",

            "error":
            str(e)

        }


# =========================================================
# AI Agent 流式聊天 API
#
# 前端读取 application/x-ndjson：
#
# {"type":"meta", ...}
# {"type":"action", "modules":[...]}
# {"type":"chunk", "content":"..."}
# {"type":"done"}
# =========================================================

@app.post("/api/agent/chat/stream")
def agent_chat_stream(
    request: AgentRequest
):

    try:

        report_context = None


        # -------------------------------------------------
        # 如果用户已经选择历史报告，严格绑定这一份报告。
        # -------------------------------------------------

        if (
            request.wallet_address
            and
            request.report_id
        ):

            historical_report = (
                _get_report_by_id(

                    request.wallet_address,

                    request.report_id

                )
            )


            if not historical_report:

                def missing_report_stream():

                    yield json.dumps(
                        {
                            "type": "chunk",
                            "content": "未找到你选择的历史报告，请重新选择后再进行分析。"
                        },
                        ensure_ascii=False
                    ) + "\n"

                    yield json.dumps(
                        {
                            "type": "done"
                        },
                        ensure_ascii=False
                    ) + "\n"


                return StreamingResponse(

                    missing_report_stream(),

                    media_type="application/x-ndjson",

                    headers={
                        "Cache-Control": "no-cache",
                        "X-Accel-Buffering": "no"
                    }

                )


            report_context = (
                _build_agent_report_context(
                    historical_report
                )
            )


        # -------------------------------------------------
        # 兼容旧版直接传 report 的调用方式。
        # -------------------------------------------------

        elif request.report:

            report_context = (
                request.report
            )


        in_scope = is_agent_question_in_scope(

            request.question,

            report=report_context,

            messages=request.messages

        )


        action_modules = (

            detect_analysis_modules(
                request.question
            )

            if in_scope

            else []

        )


        def event_stream():

            # 先发送元信息，便于前端确定业务范围。
            yield json.dumps(
                {
                    "type": "meta",
                    "scope": "in_scope" if in_scope else "out_of_scope",
                    "report_id": request.report_id
                },
                ensure_ascii=False
            ) + "\n"


            # 只有用户问题明确对应 Analysis Center 五类模块时，
            # 才提供跳转按钮。
            if action_modules:

                yield json.dumps(
                    {
                        "type": "action",
                        "modules": action_modules
                    },
                    ensure_ascii=False
                ) + "\n"


            if not in_scope:

                yield json.dumps(
                    {
                        "type": "chunk",
                        "content": OUT_OF_SCOPE_MESSAGE
                    },
                    ensure_ascii=False
                ) + "\n"

                yield json.dumps(
                    {
                        "type": "done"
                    },
                    ensure_ascii=False
                ) + "\n"

                return


            try:

                for chunk in generate_agent_answer_stream(

                    request.question,

                    report_context,

                    request.messages

                ):

                    yield json.dumps(
                        {
                            "type": "chunk",
                            "content": chunk
                        },
                        ensure_ascii=False
                    ) + "\n"


            except Exception as stream_error:

                yield json.dumps(
                    {
                        "type": "error",
                        "content": "AI 服务连接失败，请检查 Ollama 是否正常运行。",
                        "error": str(stream_error)
                    },
                    ensure_ascii=False
                ) + "\n"


            yield json.dumps(
                {
                    "type": "done"
                },
                ensure_ascii=False
            ) + "\n"


        return StreamingResponse(

            event_stream(),

            media_type="application/x-ndjson",

            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no"
            }

        )


    except Exception as e:

        def error_stream():

            yield json.dumps(
                {
                    "type": "error",
                    "content": "Agent 暂时无法完成本次回答，请稍后重试。",
                    "error": str(e)
                },
                ensure_ascii=False
            ) + "\n"

            yield json.dumps(
                {
                    "type": "done"
                },
                ensure_ascii=False
            ) + "\n"


        return StreamingResponse(

            error_stream(),

            media_type="application/x-ndjson",

            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no"
            }

        )


# =========================================================
# 数据分析 Pipeline
# =========================================================

@app.post("/api/analyze")
async def analyze(

    file: UploadFile = File(...),

    wallet_address: Optional[str] = Form(None)

):

    try:

        # -------------------------------------------------
        # 读取文件
        # -------------------------------------------------

        content = await file.read()


        filename = (
            file.filename
            or
            ""
        ).lower()



        # -------------------------------------------------
        # CSV
        # -------------------------------------------------

        if filename.endswith(
            ".csv"
        ):

            df = pd.read_csv(

                StringIO(

                    content.decode(
                        "utf-8"
                    )

                )

            )



        # -------------------------------------------------
        # XLSX
        # -------------------------------------------------

        elif filename.endswith(
            ".xlsx"
        ):

            df = pd.read_excel(

                io.BytesIO(
                    content
                )

            )



        else:

            return {

                "success":
                False,

                "message":
                "仅支持 CSV / XLSX 文件"

            }



        # -------------------------------------------------
        # 转为交易记录
        # -------------------------------------------------

        transactions = df.to_dict(

            orient="records"

        )



        # -------------------------------------------------
        # 当前旧版 Value Model
        #
        # 暂时保留，避免影响原 Dashboard / Pipeline。
        # 新用户分层不再依赖这里的权重。
        # -------------------------------------------------

        value_model = {

            "objective":
            "Revenue Growth",


            "weights": {

                "volume":
                50,

                "activity":
                30,

                "retention":
                10,

                "transaction":
                10

            }

        }



        # -------------------------------------------------
        # 执行原有 Pipeline
        # -------------------------------------------------

        result = run_pipeline(

            transactions,

            value_model

        )



        # -------------------------------------------------
        # 保存当前分析数据
        # -------------------------------------------------

        dashboard_cache[
            "transactions"
        ] = transactions


        dashboard_cache[
            "users"
        ] = result.get(

            "users",

            []

        )


        dashboard_cache[
            "value_model"
        ] = value_model



        # 上传新数据后清除旧 Segment，
        # 防止上一份数据的 Segment 被继续使用。

        dashboard_cache[
            "segment"
        ] = None



        # -------------------------------------------------
        # 保存后端历史报告
        # -------------------------------------------------

        if wallet_address:

            saved_report = save_report(

                wallet_address,

                {

                    "file": {

                        "filename":
                        file.filename

                    },

                    "analysis":
                    result

                }

            )

            result["report_id"] = saved_report["report_id"]

        return result



    except Exception as e:

        return {

            "success":
            False,

            "error":
            str(e)

        }



# =========================================================
# Dashboard
# =========================================================

@app.post("/api/dashboard")
def dashboard(
    payload: Optional[dict] = None
):

    try:

        # -------------------------------------------------
        # 历史报告详情页可以直接传入某份报告的
        # users / transactions / value_model。
        #
        # 如果没有传 payload，则继续使用原有
        # dashboard_cache，不影响当前分析流程。
        # -------------------------------------------------

        users = dashboard_cache.get(
            "users",
            []
        )

        transactions = dashboard_cache.get(
            "transactions",
            []
        )

        value_model = dashboard_cache.get(
            "value_model"
        )

        if payload:

            if "users" in payload:
                users = payload.get(
                    "users"
                ) or []

            if "transactions" in payload:
                transactions = payload.get(
                    "transactions"
                ) or []

            if payload.get(
                "value_model"
            ) is not None:
                value_model = payload.get(
                    "value_model"
                )

        return calculate_dashboard(
            users,
            transactions,
            value_model
        )


    except Exception as e:

        return {

            "success":
            False,

            "error":
            str(e)

        }



# =========================================================
# 用户指标数据分布
#
# Segment Builder 使用
# =========================================================

@app.get(
    "/api/profile/distribution"
)
async def get_profile_distribution():

    try:

        users = dashboard_cache.get(

            "users",

            []

        )


        if not users:

            return {

                "success":
                False,

                "message":
                "暂无用户数据，请先上传并分析数据"

            }



        profiles = pd.DataFrame(
            users
        )



        distribution = (
            calculate_distribution(
                profiles
            )
        )



        return {

            "success":
            True,

            "distribution":
            distribution

        }



    except Exception as e:

        return {

            "success":
            False,

            "error":
            str(e)

        }



# =========================================================
# Segment Builder
# =========================================================

@app.post(
    "/api/segment/create"
)
async def create_segment(
    request: dict
):

    try:

        users = dashboard_cache.get(

            "users",

            []

        )



        if not users:

            return {

                "success":
                False,

                "message":
                "暂无用户数据，请先上传数据"

            }



        profiles = pd.DataFrame(
            users
        )



        # -------------------------------------------------
        # 用户选择的分层规则
        # -------------------------------------------------

        rules = request.get(

            "rules",

            {}

        )



        if not rules:

            return {

                "success":
                False,

                "message":
                "请至少选择一个用户分层条件"

            }



        # -------------------------------------------------
        # 根据当前数据重新计算分布
        # -------------------------------------------------

        distribution = (
            calculate_distribution(
                profiles
            )
        )



        # -------------------------------------------------
        # 生成 Segment
        # -------------------------------------------------

        segment = build_segment(

            profiles,

            distribution,

            rules

        )



        segment_result = {

            "user_count":
            len(segment),

            "rules":
            rules,

            "users":
            segment.to_dict(
                orient="records"
            )

        }



        # 保存当前 Segment

        dashboard_cache[
            "segment"
        ] = segment_result



        return {

            "success":
            True,

            "segment":
            segment_result

        }



    except Exception as e:

        return {

            "success":
            False,

            "error":
            str(e)

        }



# =========================================================
# Segment Result + Segment Profile
# =========================================================

@app.get(
    "/api/segment/result"
)
def get_segment_result():

    try:

        segment = dashboard_cache.get(
            "segment"
        )



        if not segment:

            return {

                "success":
                False,

                "message":
                "暂无用户分层结果"

            }



        users = pd.DataFrame(

            segment.get(
                "users",
                []
            )

        )



        if users.empty:

            return {

                "success":
                True,

                "segment":
                segment,

                "profile": {

                    "用户数量":
                    0

                }

            }



        profile = {

            "用户数量":
            int(
                len(users)
            )

        }



        # -------------------------------------------------
        # 平均交易价值
        # -------------------------------------------------

        if (
            "total_volume"
            in users.columns
        ):

            profile[
                "平均交易价值"
            ] = round(

                pd.to_numeric(

                    users[
                        "total_volume"
                    ],

                    errors="coerce"

                )
                .fillna(0)
                .mean(),

                2

            )



        # -------------------------------------------------
        # 平均交易次数
        # -------------------------------------------------

        if (
            "transaction_count"
            in users.columns
        ):

            profile[
                "平均交易次数"
            ] = round(

                pd.to_numeric(

                    users[
                        "transaction_count"
                    ],

                    errors="coerce"

                )
                .fillna(0)
                .mean(),

                2

            )



        # -------------------------------------------------
        # 平均活跃天数
        # -------------------------------------------------

        if (
            "active_days"
            in users.columns
        ):

            profile[
                "平均活跃天数"
            ] = round(

                pd.to_numeric(

                    users[
                        "active_days"
                    ],

                    errors="coerce"

                )
                .fillna(0)
                .mean(),

                2

            )



        # -------------------------------------------------
        # Segment 占全部用户比例
        # -------------------------------------------------

        all_users = dashboard_cache.get(

            "users",

            []

        )


        total_users = len(
            all_users
        )



        profile[
            "用户占比"
        ] = (

            round(

                len(users)
                /
                total_users
                *
                100,

                2

            )

            if total_users

            else 0

        )



        return {

            "success":
            True,

            "segment":
            segment,

            "profile":
            profile

        }



    except Exception as e:

        return {

            "success":
            False,

            "error":
            str(e)

        }



# =========================================================
# 新增：
# Growth / Retention / Sybil
# 统一数据画像接口
#
# GET:
#
# /api/analysis/profile/growth
# /api/analysis/profile/retention
# /api/analysis/profile/sybil
# =========================================================

@app.get(
    "/api/analysis/profile/{analysis_type}"
)
def get_analysis_profile(
    analysis_type: str,
    wallet_address: str = None,
    report_id: str = None
):

    try:

        allowed_types = {

            "growth",

            "retention",

            "value",

            "sybil"

        }



        if (
            analysis_type
            not in allowed_types
        ):

            return {

                "success":
                False,

                "message":
                "不支持的分析类型"

            }



        # -------------------------------------------------
        # 如果传入 report_id
        # 使用指定历史报告
        # -------------------------------------------------

        if (
            wallet_address
            and
            report_id
        ):

            historical_report = _get_report_by_id(

                wallet_address,

                report_id

            )


            if not historical_report:

                return {

                    "success":
                    False,

                    "message":
                    "未找到指定历史报告"

                }


            analysis_data = historical_report.get(

                "analysis",

                {}

            )


            users = analysis_data.get(

                "users",

                []

            )


            transactions = analysis_data.get(

                "transactions",

                []

            )


        # -------------------------------------------------
        # 没有指定报告
        # 继续兼容原来的当前分析数据
        # -------------------------------------------------

        else:

            users = dashboard_cache.get(

                "users",

                []

            )


            transactions = dashboard_cache.get(

                "transactions",

                []

            )



        if (
            not users
            and
            not transactions
        ):

            return {

                "success":
                False,

                "message":
                "暂无分析数据，请先上传链上数据"

            }



        if (
            analysis_type
            ==
            "value"
        ):

            profile = (
                _build_value_profile(

                    users,

                    transactions

                )
            )

        else:

            profile = (
                build_analysis_profile(

                    analysis_type,

                    users,

                    transactions

                )
            )



        return {

            "success":
            True,

            "analysis_type":
            analysis_type,

            "profile":
            profile

        }



    except Exception as e:

        return {

            "success":
            False,

            "error":
            str(e)

        }



# =========================================================
# 统一 AI Strategy Engine
#
# 五种类型共用：
#
# activation
# value
# growth
# retention
# sybil
# =========================================================

@app.post(
    "/api/ai/strategy"
)
async def ai_strategy(
    request: dict
):

    try:

        # -------------------------------------------------
        # 用户价值页面目前如果没有传 analysis_type，
        # 默认按 value 处理。
        # -------------------------------------------------

        analysis_type = (

            request.get(
                "analysis_type"
            )

            or

            request.get(
                "type"
            )

            or

            "value"

        )



        allowed_types = {

            "activation",

            "value",

            "growth",

            "retention",

            "sybil"

        }



        if (
            analysis_type
            not in allowed_types
        ):

            return {

                "success":
                False,

                "message":
                "不支持的 AI 分析类型"

            }



        profile = request.get(

            "profile",

            {}

        )



        if not profile:

            return {

                "success":
                False,

                "message":
                "缺少用户画像数据"

            }



        strategy = generate_strategy(

            profile,

            analysis_type

        )



        return {

            "success":
            True,

            "analysis_type":
            analysis_type,

            "strategy":
            strategy

        }



    except Exception as e:

        return {

            "success":
            False,

            "error":
            str(e)

        }



# =========================================================
# Value Model 检查
# 保留旧功能
# =========================================================

@app.post(
    "/api/value-model/check"
)
def check_value_model(
    payload: dict
):

    try:

        from backend.analytics.value_model import (
            validate_value_model
        )


        return validate_value_model(

            payload.get(
                "value_model"
            )

        )


    except Exception as e:

        return {

            "success":
            False,

            "error":
            str(e)

        }



# =========================================================
# 用户个人信息
# =========================================================

@app.get(
    "/api/profile/{wallet_address}"
)
def profile(
    wallet_address: str
):

    return get_profile(
        wallet_address
    )



# =========================================================
# 用户历史报告
# =========================================================

@app.get(
    "/api/reports/{wallet_address}"
)
def reports(
    wallet_address: str
):

    return {

        "reports":
        get_report_indexes(
            wallet_address
        )

    }


# =========================================================
# 单份历史报告详情
#
# 前端只保存轻量索引。
# 查看详情时通过 wallet_address + report_id
# 从 backend/reportdata 按需读取完整报告。
# =========================================================

@app.get(
    "/api/reports/{wallet_address}/{report_id}"
)
def report_detail(
    wallet_address: str,
    report_id: str
):

    try:

        report = get_report(
            wallet_address,
            report_id
        )

        if not report:

            return {
                "success":
                    False,

                "message":
                    "未找到指定历史报告"
            }

        return {
            "success":
                True,

            "report":
                report
        }

    except Exception as e:

        return {
            "success":
                False,

            "error":
                str(e)
        }




# =========================================================
# 删除单份历史报告
# =========================================================

@app.delete(
    "/api/reports/{wallet_address}/{report_id}"
)
def delete_report_api(
    wallet_address: str,
    report_id: str
):

    try:

        deleted = delete_report(
            wallet_address,
            report_id
        )

        if not deleted:

            return {
                "success":
                    False,

                "message":
                    "未找到指定历史报告"
            }

        return {
            "success":
                True,

            "report_id":
                report_id
        }

    except Exception as e:

        return {
            "success":
                False,

            "error":
                str(e)
        }


# =========================================================
# 旧版 Growth Analysis API
#
# 暂时保留兼容。
# 新页面之后主要使用：
#
# /api/analysis/profile/{type}
# +
# /api/ai/strategy
# =========================================================

@app.post(
    "/api/growth-analysis"
)
def growth_analysis(
    payload: dict
):

    try:

        analysis_type = payload.get(
            "type"
        )



        # 前端旧名字兼容

        if (
            analysis_type
            ==
            "user_value"
        ):

            analysis_type = "value"



        # -------------------------------------------------
        # Value
        # -------------------------------------------------

        if (
            analysis_type
            ==
            "value"
        ):

            segment = dashboard_cache.get(
                "segment"
            )


            if not segment:

                return {

                    "success":
                    False,

                    "message":
                    "请先生成用户价值 Segment"

                }


            users = pd.DataFrame(

                segment.get(
                    "users",
                    []
                )

            )


            profile_data = {

                "用户数量":
                len(users)

            }


            if (
                not users.empty
                and
                "total_volume"
                in users.columns
            ):

                profile_data[
                    "平均交易价值"
                ] = round(

                    pd.to_numeric(

                        users[
                            "total_volume"
                        ],

                        errors="coerce"

                    )
                    .fillna(0)
                    .mean(),

                    2

                )


            return {

                "success":
                True,

                "analysis_type":
                "value",

                "profile":
                profile_data

            }



        # -------------------------------------------------
        # Growth / Retention / Sybil
        # -------------------------------------------------

        if analysis_type in {

            "growth",

            "retention",

            "sybil"

        }:

            profile_data = (
                build_analysis_profile(

                    analysis_type,

                    dashboard_cache.get(
                        "users",
                        []
                    ),

                    dashboard_cache.get(
                        "transactions",
                        []
                    )

                )
            )


            return {

                "success":
                True,

                "analysis_type":
                analysis_type,

                "profile":
                profile_data

            }



        return {

            "success":
            False,

            "message":
            "请选择有效分析类型"

        }



    except Exception as e:

        return {

            "success":
            False,

            "error":
            str(e)

        }