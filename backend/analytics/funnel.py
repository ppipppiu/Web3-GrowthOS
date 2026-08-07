"""
用户增长漏斗分析

负责:
1. 用户行为阶段划分
2. 转化率计算
3. 流失分析

"""


def calculate_funnel(

    users

):

    """
    根据用户画像数据计算增长漏斗


    users:

    [
        {
            wallet_address:"",
            transaction_count:,
            total_volume:,
            value_level:""
        }
    ]

    """



    if not users:


        return {


            "funnel":[],

            "conversion":[]


        }





    total_users=len(users)




    # 第一层
    # 钱包用户


    wallet_users=total_users





    # 第二层
    # 完成至少一次交易


    transaction_users=len(

        [

            u

            for u in users

            if u.get(
                "transaction_count",
                0
            ) >=1

        ]

    )





    # 第三层
    # 多次交易用户


    repeat_users=len(

        [

            u

            for u in users

            if u.get(
                "transaction_count",
                0
            ) >=2

        ]

    )





    # 第四层
    # 高价值用户

    high_value_users=len(

        [

            u

            for u in users

            if u.get(
                "value_level"
            )

            ==

            "高价值用户"

        ]

    )






    # 第五层
    # 长期活跃用户

    active_users=len(

        [

            u

            for u in users

            if (

                u.get(
                    "transaction_count",
                    0
                )

                >=5

                and

                u.get(
                    "value_score",
                    0
                )

                >=50

            )

        ]

    )






    funnel=[


        {

            "stage":
            "钱包用户",

            "count":
            wallet_users

        },


        {

            "stage":
            "首次交易用户",

            "count":
            transaction_users

        },


        {

            "stage":
            "重复交易用户",

            "count":
            repeat_users

        },


        {

            "stage":
            "高价值用户",

            "count":
            high_value_users

        },


        {

            "stage":
            "长期活跃用户",

            "count":
            active_users

        }


    ]







    conversion=[]



    for index,item in enumerate(funnel):


        if index==0:


            conversion.append(

                {

                    "stage":
                    item["stage"],


                    "count":
                    item["count"],


                    "conversion_rate":
                    100

                }

            )


        else:



            previous=funnel[index-1]["count"]



            if previous==0:


                rate=0


            else:


                rate=round(

                    item["count"]

                    /

                    previous

                    *

                    100,

                    2

                )





            conversion.append(

                {


                    "stage":
                    item["stage"],


                    "count":
                    item["count"],


                    "conversion_rate":
                    rate

                }

            )







    return {


        "funnel":funnel,


        "conversion":conversion,


        "summary":{


            "total_users":
            wallet_users,


            "first_transaction_rate":

            round(

                transaction_users

                /

                wallet_users

                *

                100,

                2

            )

            if wallet_users

            else 0,



            "repeat_transaction_rate":

            round(

                repeat_users

                /

                transaction_users

                *

                100,

                2

            )

            if transaction_users

            else 0



        }


    }
