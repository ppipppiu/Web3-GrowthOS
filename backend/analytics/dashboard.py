"""
Dashboard 数据分析模块


职责：

1. 汇总核心指标
2. 返回用户价值分布
3. 返回用户漏斗
4. 返回用户明细


不负责：

- AI分析
- 用户画像
- 增长策略

"""



from collections import Counter

from backend.analytics.funnel import calculate_funnel

from backend.analytics.value_model import (
    calculate_value_score,
    classify_value_level
)





def calculate_dashboard(

    users,

    transactions,

    value_model

):
    if value_model is None:

        value_model = {

            "weights": {

                "volume":50,

                "activity":30,

                "transaction":20

            }

        }


    users = calculate_value_score(
        users,
        value_model
    )



    """
    Dashboard 主计算函数


    参数：

    users:
        用户画像数据


    transactions:
        交易数据


    value_model:
        用户自定义价值模型


    """



    if users is None:

        users=[]


    if transactions is None:

        transactions=[]





    # =========================
    # 1. 用户价值计算
    # =========================


    users = calculate_value_score(

        users,

        value_model

    )



    users = classify_value_level(

        users

    )







    # =========================
    # 2. 核心指标
    # =========================


    total_wallets=len(

        users

    )



    total_transactions=len(

        transactions

    )



    total_volume=sum(

        [

            float(

                t.get("amount_usd")

                or

                t.get("amount")

                or

                t.get("value")

                or

                t.get("volume")

                or

                t.get("transaction_value")

                or

                0

            )

            for t in transactions

        ]

    )




    avg_transaction=(


        total_volume

        /

        total_transactions


        if total_transactions

        else 0

    )









    # =========================
    # 3. 用户价值分布
    # =========================


    value_distribution=Counter(

        [

            user.get(

                "value_level",

                "未知"

            )

            for user in users

        ]

    )



    value_distribution=[


        {


            "level":key,


            "count":value


        }


        for key,value

        in value_distribution.items()

    ]








    # =========================
    # 4. 用户漏斗
    # =========================


    funnel_result=calculate_funnel(

        users

    )









    # =========================
    # 5. 用户列表
    # =========================


    user_table=[]



    for user in users:



        user_table.append(

            {


                "wallet_address":

                user.get(

                    "wallet_address",

                    ""

                ),



                "transaction_count":

                user.get(

                    "transaction_count",

                    0

                ),



                "total_volume":

                user.get(

                    "total_volume",

                    0

                ),



                "value_score":

                user.get(

                    "value_score",

                    0

                ),



                "value_level":

                user.get(

                    "value_level",

                    "普通用户"

                )

            }

        )








    return {



        "overview":{


            "钱包数量":

            total_wallets,


            "交易数量":

            total_transactions,


            "交易价值":

            round(

                total_volume,

                2

            ),



            "平均交易价值":

            round(

                avg_transaction,

                2

            )


        },



        "value_distribution":

        value_distribution,



        "funnel":

        funnel_result,



        "users":

        user_table

    }