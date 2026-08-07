from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.services.pipeline import run_pipeline

from backend.analytics.dashboard import calculate_dashboard
from backend.services.pipeline import run_pipeline
from backend.analytics.dashboard import calculate_dashboard
from backend.services.report_storage import (
    save_report,
    get_reports,
    get_profile
)

app = FastAPI()
# 临时保存最近一次分析结果
dashboard_cache = {
    "users": [],
    "transactions": [],
    "value_model": None
}


# ======================
# CORS
# ======================


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







# ======================
# 健康检查
# ======================


@app.get("/")

def home():


    return {


        "message":

        "Web3 GrowthOS API Running"

    }







# ======================
# 价值模型检查
# ======================


@app.post("/api/value-model/check")

def check_value_model(

    payload:dict

):


    from backend.analytics.value_model import validate_value_model



    return validate_value_model(

        payload.get(

            "value_model"

        )

    )







# ======================
# 数据分析 Pipeline
# ======================


from fastapi import UploadFile, File


@app.post("/api/analyze")
async def analyze(

    file: UploadFile = File(...),

    wallet_address: str = None

):


    import pandas as pd

    from io import StringIO



    content = await file.read()



    df = pd.read_csv(

        StringIO(

            content.decode("utf-8")

        )

    )



    transactions = df.to_dict(

        orient="records"

    )



    value_model = {

        "objective":

        "Revenue Growth",


        "weights":{


            "volume":50,

            "activity":30,

            "retention":10,

            "transaction":10


        }

    }




    result = run_pipeline(
    transactions,
    value_model
    )


    # 保存Dashboard数据

    dashboard_cache["transactions"] = transactions

    dashboard_cache["users"] = result.get(
        "users",
        []
    )

    dashboard_cache["value_model"] = value_model


    return result

    # ======================
    # 保存用户报告
    # ======================

    if wallet_address:


        save_report(

            wallet_address,


            {

                "file":{

                    "filename":
                    file.filename

                },


                "analysis":

                result

            }

        )

# ======================
# Dashboard
# ======================


@app.post("/api/dashboard")
def dashboard():

    return calculate_dashboard(

        dashboard_cache["users"],

        dashboard_cache["transactions"],

        dashboard_cache["value_model"]

    )



    return calculate_dashboard(

        users,

        transactions,

        value_model

    )

# ======================
# 用户个人信息
# ======================


@app.get(
    "/api/profile/{wallet_address}"
)
def profile(

    wallet_address:str

):


    return get_profile(

        wallet_address

    )

# ======================
# 用户历史报告
# ======================


@app.get(
    "/api/reports/{wallet_address}"
)
def reports(

    wallet_address:str

):


    return {


        "reports":

        get_reports(

            wallet_address

        )

    }


# ======================
# AI增长分析中心
# ======================


@app.post("/api/growth-analysis")
def growth_analysis(
    payload: dict
):


    analysis_type = payload.get(
        "type"
    )


    users = payload.get(
        "users",
        []
    )


    transactions = payload.get(
        "transactions",
        []
    )



    # ======================
    # 用户价值分析
    # ======================

    if analysis_type == "user_value":



        total_users = len(users)



        high_value_users = [

            user

            for user in users

            if user.get(
                "value_level"
            )

            in

            [

                "高价值用户",

                "核心用户"

            ]

        ]



        high_value_rate = (


            len(high_value_users)

            /

            total_users

            *

            100


            if total_users

            else 0

        )



        total_volume = sum(


            float(

                user.get(

                    "total_volume",

                    0

                )

            )


            for user in users


        )



        return {



            "title":

            "用户价值分析",





            "insight":


            f"当前分析 {total_users} 个钱包用户，其中高价值用户占比 {high_value_rate:.2f}%，整体交易价值贡献主要集中在高价值用户群体。",





            "profile":{



                "核心特征":


                "高价值用户通常具有更高交易频率、更高交易金额以及更持续的链上参与行为",





                "用户类型":


                "核心价值用户"

            },






            "metrics":{



                "用户总数":

                total_users,



                "高价值用户数量":

                len(high_value_users),



                "总交易价值":

                round(

                    total_volume,

                    2

                )

            },





            "strategy":[



                "针对高价值用户建立长期激励体系，提高持续参与率",



                "针对成长用户设计任务和奖励机制，促进价值提升",



                "针对普通用户优化首次交互体验，提高转化效率"

            ]

        }






    # ======================
    # 用户留存分析
    # ======================

    elif analysis_type == "retention":


        return {



            "title":

            "用户留存分析",



            "insight":

            "部分钱包完成首次交易后没有形成持续交互行为，需要关注用户生命周期。",



            "profile":{


                "用户类型":

                "一次性交易用户"

            },



            "strategy":[


                "设计二次交易激励",


                "增加持续任务机制"


            ]

        }







    # ======================
    # 用户增长分析
    # ======================

    elif analysis_type == "growth":



        return {



            "title":

            "用户增长分析",



            "insight":

            "用户增长主要来源于新增钱包和活跃交易行为。",



            "profile":{


                "增长用户":

                "新增钱包用户以及高活跃交易用户"

            },



            "strategy":[



                "优化首次交易体验",



                "提升新用户激活效率"

            ]

        }







    # ======================
    # Sybil风险分析
    # ======================

    elif analysis_type == "sybil":



        return {



            "title":

            "Sybil风险分析",



            "insight":

            "通过钱包行为模式识别潜在异常地址。",



            "profile":{


                "风险用户":

                "行为高度相似的钱包群体"

            },



            "strategy":[



                "建立钱包信誉评分",



                "识别异常交易模式"


            ]

        }







    else:


        return {


            "message":

            "请选择有效分析类型"

        }