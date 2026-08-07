"""
链上交易数据标准化模块

作用：

将不同来源的数据转换为统一格式

支持：

- sample CSV
- Dune Analytics
- Moralis
- RPC导出数据

"""





def get_first_value(row, keys, default=None):

    """
    按优先级读取字段

    """

    for key in keys:

        if key in row and row[key] not in [

            None,

            ""

        ]:

            return row[key]


    return default





def normalize_transaction(row):


    """
    单条交易标准化

    """



    wallet_address = get_first_value(

        row,

        [

            "wallet_address",

            "wallet",

            "address",

            "from_address",

            "sender"

        ],

        ""

    )




    transaction_hash = get_first_value(

        row,

        [

            "transaction_hash",

            "tx_hash",

            "hash"

        ],

        ""

    )




    timestamp = get_first_value(

        row,

        [

            "timestamp",

            "block_time",

            "block_timestamp",

            "time"

        ],

        ""

    )






    # 交易价值

    transaction_value = get_first_value(

        row,

        [

            "transaction_value",

            "amount_usd",

            "amount",

            "value",

            "quote"

        ],

        0

    )





    # Gas费用

    gas_fee = get_first_value(

        row,

        [

            "gas_fee",

            "gas_fee_usd",

            "gas"

        ],

        0

    )






    token = get_first_value(

        row,

        [

            "token_symbol",

            "token",

            "symbol"

        ],

        ""

    )





    action = get_first_value(

        row,

        [

            "action_type",

            "action",

            "method"

        ],

        "transaction"

    )






    try:

        transaction_value=float(

            transaction_value

        )

    except:


        transaction_value=0





    try:

        gas_fee=float(

            gas_fee

        )

    except:


        gas_fee=0







    return {


        "wallet_address":

        wallet_address,



        "transaction_hash":

        transaction_hash,



        "timestamp":

        timestamp,



        "transaction_value":

        transaction_value,



        "gas_fee":

        gas_fee,



        "token":

        token,



        "action":

        action


    }








def normalize_transactions(rows):


    """
    批量标准化

    """



    normalized=[]



    for row in rows:


        tx = normalize_transaction(

            row

        )



        if tx["wallet_address"]:



            normalized.append(

                tx

            )



    return normalized