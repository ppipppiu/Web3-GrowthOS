"""
GrowthOS 数据分析 Pipeline

负责：

1. 数据清洗
2. 用户聚合
3. 指标计算
4. 用户价值计算
5. 用户分层

"""


from backend.analytics.value_model import (
    validate_value_model,
    calculate_value_score,
    classify_value_level
)



def run_pipeline(
    transactions,
    value_model
):


    """
    主分析流程

    transactions:
    标准化后的链上交易数据

    value_model:
    用户定义价值模型

    """



    # =====================
    # 1. 数据检查
    # =====================

    if not transactions:

        return {

            "success": False,

            "message": "没有可分析数据"

        }



    # =====================
    # 2. 校验价值模型
    # =====================


    check_result = validate_value_model(
        value_model
    )


    if not check_result["valid"]:

        return {

            "success":False,

            "message":
            check_result["message"]

        }



    # =====================
    # 3. 用户聚合
    # =====================


    users = {}



    for tx in transactions:


        wallet = tx.get(
            "wallet_address"
        )


        if not wallet:

            continue



        if wallet not in users:


            users[wallet] = {

                "wallet_address":wallet,

                "transaction_count":0,

                "total_volume":0,

                "total_gas_fee":0,

                "tokens":set(),

                "actions":set(),

                "transaction_times":[]

            }



        user = users[wallet]


        # 交易次数

        user["transaction_count"] += 1



        # 交易价值

        volume = (

            tx.get("amount_usd")

            or

            tx.get("amount")

            or

            tx.get("value")

            or

            tx.get("transaction_value")

            or

            0

        )


        user["total_volume"] += float(volume)



        # gas消耗

        gas = (

            tx.get("gas_fee_usd")

            or

            tx.get("gas_fee")

            or

            0

        )


        user["total_gas_fee"] += float(gas)



        # token行为

        token = tx.get(
            "token_symbol"
        )


        if token:

            user["tokens"].add(
                token
            )



        # action行为

        action = tx.get(
            "action_type"
        )


        if action:

            user["actions"].add(
                action
            )



        # 时间

        time = tx.get(
            "block_time"
        )


        if time:

            user["transaction_times"].append(
                time
            )




    # =====================
    # 4. 格式转换
    # =====================


    user_profiles=[]



    for wallet,user in users.items():


        profile={

            "wallet_address":
            wallet,


            "transaction_count":
            user["transaction_count"],


            "total_volume":
            round(
                user["total_volume"],
                2
            ),


            "total_gas_fee":
            round(
                user["total_gas_fee"],
                4
            ),


            "unique_tokens":
            len(
                user["tokens"]
            ),


            "unique_actions":
            len(
                user["actions"]
            )

        }



        if user["transaction_times"]:


            profile["first_transaction"] = min(
                user["transaction_times"]
            )


            profile["last_transaction"] = max(
                user["transaction_times"]
            )


        user_profiles.append(
            profile
        )



    # =====================
    # 5. 价值评分
    # =====================


    user_profiles = calculate_value_score(

        user_profiles,

        value_model

    )



    # =====================
    # 6. 用户分层
    # =====================


    user_profiles = classify_value_level(

        user_profiles

    )



    # =====================
    # 7. 返回
    # =====================


    return {


        "success":True,


        "users":
        user_profiles,


        "transactions":
        transactions,


        "value_model":
        value_model

    }





class AnalysisPipeline:


    def run(
        self,
        transactions,
        value_model=None
    ):


        return run_pipeline(

            transactions,

            value_model

        )