import io
from io import StringIO

import pandas as pd

from fastapi import (
    FastAPI,
    UploadFile,
    File
)

from fastapi.middleware.cors import (
    CORSMiddleware
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


# =========================================================
# 报告相关
# =========================================================

from backend.services.report_storage import (
    save_report,
    get_reports,
    get_profile
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
# 数据分析 Pipeline
# =========================================================

@app.post("/api/analyze")
async def analyze(

    file: UploadFile = File(...),

    wallet_address: str = None

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
def dashboard():

    try:

        return calculate_dashboard(

            dashboard_cache[
                "users"
            ],

            dashboard_cache[
                "transactions"
            ],

            dashboard_cache[
                "value_model"
            ]

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
    analysis_type: str
):

    try:

        allowed_types = {

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
                "不支持的分析类型"

            }



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
# 四种类型共用：
#
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
        get_reports(
            wallet_address
        )

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