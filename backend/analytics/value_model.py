"""
用户价值模型

负责：

1. 用户定义价值权重校验
2. 价值评分计算
3. 用户价值等级划分

"""


SUPPORTED_METRICS = {


    "volume":{

        "name":"交易价值",

        "min":10,

        "max":70

    },


    "activity":{

        "name":"活跃度",

        "min":10,

        "max":50

    },


    "transaction":{

        "name":"交易频率",

        "min":10,

        "max":50

    },


    "retention":{

        "name":"持续行为",

        "min":0,

        "max":50

    }

}





def validate_value_model(value_model):


    if not value_model:


        return {

            "valid":False,

            "message":"未设置价值模型"

        }



    weights=value_model.get(
        "weights",
        {}
    )


    if not weights:


        return {

            "valid":False,

            "message":"缺少权重配置"

        }



    if sum(weights.values()) != 100:


        return {

            "valid":False,

            "message":"价值模型权重总和必须等于100"

        }



    for metric,weight in weights.items():


        if metric not in SUPPORTED_METRICS:


            return {

                "valid":False,

                "message":
                f"不支持指标:{metric}"

            }



        rule=SUPPORTED_METRICS[metric]


        if weight < rule["min"] or weight > rule["max"]:


            return {

                "valid":False,

                "message":
                f"{rule['name']}权重范围:{rule['min']}%-{rule['max']}%"

            }



    return {


        "valid":True,

        "message":"价值模型合法",

        "normalized_model":
        value_model

    }





def calculate_value_score(
    profiles,
    value_model
):


    weights=value_model["weights"]



    max_volume=max(

        [
            p["total_volume"]
            for p in profiles
        ]

        or [1]

    )



    max_transactions=max(

        [
            p["transaction_count"]
            for p in profiles
        ]

        or [1]

    )



    for user in profiles:



        volume_score = (

            user["total_volume"]

            /

            max_volume

        )


        activity_score = (

            user["transaction_count"]

            /

            max_transactions

        )


        transaction_score = activity_score



        retention_score = activity_score




        user["value_score"]=round(

            (

            volume_score
            *
            weights.get("volume",0)


            +

            activity_score
            *
            weights.get("activity",0)


            +

            transaction_score
            *
            weights.get("transaction",0)


            +

            retention_score
            *
            weights.get("retention",0)

            ),

            2

        )



    return profiles





def classify_value_level(
    profiles
):

    if not profiles:
        return profiles

    scores = sorted(
        [
            float(p.get("value_score", 0) or 0)
            for p in profiles
        ]
    )

    n = len(scores)

    def threshold(percentile):
        index = min(
            int(n * percentile),
            n - 1
        )
        return scores[index]

    q25 = threshold(0.25)
    q50 = threshold(0.50)
    q75 = threshold(0.75)

    for user in profiles:
        score = float(
            user.get("value_score", 0)
            or 0
        )

        if score >= q75:
            user["value_level"] = "高价值用户"
        elif score >= q50:
            user["value_level"] = "潜力用户"
        elif score >= q25:
            user["value_level"] = "普通用户"
        else:
            user["value_level"] = "低价值用户"

    return profiles

