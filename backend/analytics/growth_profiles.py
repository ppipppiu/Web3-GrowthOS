import pandas as pd


# =========================================================
# 基础工具
# =========================================================


def _safe_dataframe(data):

    if data is None:

        return pd.DataFrame()


    if isinstance(
        data,
        pd.DataFrame
    ):

        return data.copy()


    return pd.DataFrame(
        data
    )




def _prepare_transactions(
    transactions
):

    df = _safe_dataframe(
        transactions
    )


    if df.empty:

        return df


    # -------------------------
    # 时间字段
    # -------------------------

    if "block_time" in df.columns:

        df["block_time"] = pd.to_datetime(

            df["block_time"],

            errors="coerce",

            utc=True

        )


    # -------------------------
    # 金额字段
    # -------------------------

    amount_field = None


    possible_amount_fields = [

        "amount_usd",

        "amount",

        "value",

        "transaction_value"

    ]


    for field in possible_amount_fields:

        if field in df.columns:

            amount_field = field

            break


    if amount_field:

        df["_amount"] = pd.to_numeric(

            df[amount_field],

            errors="coerce"

        ).fillna(0)


    else:

        df["_amount"] = 0.0


    return df




def _round_percent(
    value
):

    return round(
        float(value) * 100,
        2
    )




# =========================================================
# 1. 用户增长画像
# =========================================================


def build_growth_profile(
    users,
    transactions
):


    users_df = _safe_dataframe(
        users
    )


    tx_df = _prepare_transactions(
        transactions
    )



    total_users = len(
        users_df
    )


    total_transactions = len(
        tx_df
    )



    profile = {

        "分析类型":
        "用户增长分析",

        "用户总数":
        int(total_users),

        "交易总数":
        int(total_transactions)

    }




    # =========================
    # 用户交易行为
    # =========================


    if (
        not users_df.empty
        and
        "transaction_count"
        in users_df.columns
    ):


        transaction_count = pd.to_numeric(

            users_df[
                "transaction_count"
            ],

            errors="coerce"

        ).fillna(0)



        repeat_users = int(

            (
                transaction_count >= 2
            ).sum()

        )



        profile[
            "重复交互用户数"
        ] = repeat_users



        profile[
            "重复交互用户占比"
        ] = (

            round(
                repeat_users
                /
                total_users
                *
                100,
                2
            )

            if total_users

            else 0

        )



        profile[
            "平均每钱包交易次数"
        ] = round(

            transaction_count.mean(),

            2

        )




    # =========================
    # 时间增长情况
    # =========================


    if (

        not tx_df.empty

        and

        "wallet_address"
        in tx_df.columns

        and

        "block_time"
        in tx_df.columns

    ):


        valid_tx = tx_df.dropna(

            subset=[
                "block_time"
            ]

        ).copy()



        if not valid_tx.empty:


            data_start = (
                valid_tx[
                    "block_time"
                ]
                .min()
            )


            data_end = (
                valid_tx[
                    "block_time"
                ]
                .max()
            )



            profile[
                "数据开始时间"
            ] = str(
                data_start
            )


            profile[
                "数据结束时间"
            ] = str(
                data_end
            )



            profile[
                "数据窗口天数"
            ] = int(

                (
                    data_end
                    -
                    data_start
                ).days
                +
                1

            )



            # -------------------------
            # 每个钱包第一次出现时间
            # -------------------------


            first_seen = (

                valid_tx

                .groupby(
                    "wallet_address"
                )[
                    "block_time"
                ]

                .min()

            )



            # -------------------------
            # 最近7天
            # -------------------------


            recent_7_start = (

                data_end

                -
                pd.Timedelta(
                    days=6
                )

            )



            recent_7 = valid_tx[

                valid_tx[
                    "block_time"
                ]
                >=
                recent_7_start

            ]



            active_7 = int(

                recent_7[
                    "wallet_address"
                ]
                .nunique()

            )



            new_7 = int(

                (
                    first_seen
                    >=
                    recent_7_start
                )
                .sum()

            )



            profile[
                "最近7天活跃钱包数"
            ] = active_7


            profile[
                "最近7天新增钱包数"
            ] = new_7



            # -------------------------
            # 最近30天
            # -------------------------


            recent_30_start = (

                data_end

                -
                pd.Timedelta(
                    days=29
                )

            )



            recent_30 = valid_tx[

                valid_tx[
                    "block_time"
                ]
                >=
                recent_30_start

            ]



            profile[
                "最近30天活跃钱包数"
            ] = int(

                recent_30[
                    "wallet_address"
                ]
                .nunique()

            )



    return profile




# =========================================================
# 2. 用户留存画像
# =========================================================


def build_retention_profile(
    users,
    transactions
):


    users_df = _safe_dataframe(
        users
    )


    tx_df = _prepare_transactions(
        transactions
    )



    total_users = len(
        users_df
    )



    profile = {

        "分析类型":
        "用户留存分析",

        "用户总数":
        int(total_users)

    }




    # =========================
    # 重复交互情况
    # =========================


    if (

        not users_df.empty

        and

        "transaction_count"
        in users_df.columns

    ):


        tx_count = pd.to_numeric(

            users_df[
                "transaction_count"
            ],

            errors="coerce"

        ).fillna(0)



        repeat_users = int(

            (
                tx_count >= 2
            ).sum()

        )



        profile[
            "重复交互用户数"
        ] = repeat_users



        profile[
            "重复交互用户占比"
        ] = (

            round(

                repeat_users
                /
                total_users
                *
                100,

                2

            )

            if total_users

            else 0

        )




    # =========================
    # 留存计算
    # =========================


    if (

        tx_df.empty

        or

        "wallet_address"
        not in tx_df.columns

        or

        "block_time"
        not in tx_df.columns

    ):


        return profile




    valid_tx = tx_df.dropna(

        subset=[
            "block_time"
        ]

    ).copy()



    if valid_tx.empty:

        return profile




    data_end = (

        valid_tx[
            "block_time"
        ]
        .max()

    )



    grouped = (

        valid_tx

        .groupby(
            "wallet_address"
        )[
            "block_time"
        ]

        .apply(
            lambda x:
            sorted(
                x.tolist()
            )
        )

    )



    # =========================
    # 7日留存
    # =========================


    eligible_7 = 0

    retained_7 = 0



    # =========================
    # 30日留存
    # =========================


    eligible_30 = 0

    retained_30 = 0



    # =========================
    # 用户活跃跨度
    # =========================


    active_spans = []




    for wallet, times in grouped.items():


        if not times:

            continue



        first_time = times[0]

        last_time = times[-1]



        active_span = (

            last_time
            -
            first_time

        ).days



        active_spans.append(
            active_span
        )




        # -------------------------
        # 7日观察窗口
        # -------------------------


        if (

            first_time
            <=
            data_end
            -
            pd.Timedelta(
                days=7
            )

        ):


            eligible_7 += 1



            has_return_7 = any(

                first_time
                <
                time
                <=
                first_time
                +
                pd.Timedelta(
                    days=7
                )

                for time in times[
                    1:
                ]

            )



            if has_return_7:

                retained_7 += 1




        # -------------------------
        # 30日观察窗口
        # -------------------------


        if (

            first_time
            <=
            data_end
            -
            pd.Timedelta(
                days=30
            )

        ):


            eligible_30 += 1



            has_return_30 = any(

                first_time
                <
                time
                <=
                first_time
                +
                pd.Timedelta(
                    days=30
                )

                for time in times[
                    1:
                ]

            )



            if has_return_30:

                retained_30 += 1




    profile[
        "7日可观察用户数"
    ] = int(
        eligible_7
    )



    profile[
        "7日留存用户数"
    ] = int(
        retained_7
    )



    profile[
        "7日留存率"
    ] = (

        round(

            retained_7
            /
            eligible_7
            *
            100,

            2

        )

        if eligible_7

        else 0

    )




    profile[
        "30日可观察用户数"
    ] = int(
        eligible_30
    )



    profile[
        "30日留存用户数"
    ] = int(
        retained_30
    )



    profile[
        "30日留存率"
    ] = (

        round(

            retained_30
            /
            eligible_30
            *
            100,

            2

        )

        if eligible_30

        else 0

    )




    if active_spans:


        profile[
            "平均用户活跃跨度天数"
        ] = round(

            sum(
                active_spans
            )
            /
            len(
                active_spans
            ),

            2

        )




    # =========================
    # 最近30天沉默钱包
    # =========================


    last_seen = (

        valid_tx

        .groupby(
            "wallet_address"
        )[
            "block_time"
        ]

        .max()

    )



    inactive_30 = int(

        (
            last_seen
            <
            data_end
            -
            pd.Timedelta(
                days=30
            )
        )
        .sum()

    )



    profile[
        "最近30天沉默钱包数"
    ] = inactive_30



    profile[
        "最近30天沉默钱包占比"
    ] = (

        round(

            inactive_30
            /
            len(
                last_seen
            )
            *
            100,

            2

        )

        if len(
            last_seen
        )

        else 0

    )



    return profile




# =========================================================
# 3. Sybil 风险画像
# =========================================================


def build_sybil_profile(
    users,
    transactions
):


    users_df = _safe_dataframe(
        users
    )


    tx_df = _prepare_transactions(
        transactions
    )



    total_users = len(
        users_df
    )



    profile = {

        "分析类型":
        "Sybil风险分析",

        "钱包总数":
        int(total_users)

    }



    if (

        tx_df.empty

        or

        "wallet_address"
        not in tx_df.columns

    ):


        profile[
            "潜在风险钱包数"
        ] = 0


        profile[
            "潜在风险钱包占比"
        ] = 0


        return profile




    # =====================================================
    # 每个钱包构建风险信号
    #
    # 这里只做启发式风险识别，
    # 不直接认定钱包就是 Sybil。
    # =====================================================


    wallet_signals = {}



    for wallet, group in tx_df.groupby(
        "wallet_address"
    ):


        signals = []



        tx_count = len(
            group
        )



        # -------------------------
        # 信号1：
        # 行为类型过于单一
        # -------------------------


        if "action_type" in group.columns:


            unique_actions = (

                group[
                    "action_type"
                ]

                .dropna()

                .nunique()

            )



            if (

                tx_count >= 3

                and

                unique_actions <= 1

            ):


                signals.append(
                    "行为类型高度单一"
                )




        # -------------------------
        # 信号2：
        # 交易金额高度重复
        # -------------------------


        if tx_count >= 3:


            amount_counts = (

                group[
                    "_amount"
                ]

                .round(6)

                .value_counts()

            )



            if not amount_counts.empty:


                repeat_ratio = (

                    amount_counts.iloc[0]

                    /
                    tx_count

                )



                if repeat_ratio >= 0.8:


                    signals.append(
                        "交易金额模式高度重复"
                    )




        # -------------------------
        # 信号3：
        # 同一天出现集中交易
        # -------------------------


        if (

            "block_time"
            in group.columns

        ):


            valid_time = group.dropna(

                subset=[
                    "block_time"
                ]

            ).copy()



            if not valid_time.empty:


                day_counts = (

                    valid_time[
                        "block_time"
                    ]

                    .dt.date

                    .value_counts()

                )



                if (

                    not day_counts.empty

                    and

                    day_counts.max()
                    >= 3

                ):


                    signals.append(
                        "短时间内存在集中交互"
                    )




        wallet_signals[
            wallet
        ] = signals




    # =====================================================
    # 高频钱包信号
    # =====================================================


    if (

        not users_df.empty

        and

        "transaction_count"
        in users_df.columns

    ):


        tx_counts = pd.to_numeric(

            users_df[
                "transaction_count"
            ],

            errors="coerce"

        ).fillna(0)



        high_frequency_threshold = float(

            tx_counts.quantile(
                0.90
            )

        )



        profile[
            "高频交互阈值"
        ] = round(

            high_frequency_threshold,

            2

        )



        high_frequency_wallets = (

            users_df.loc[

                tx_counts
                >=
                high_frequency_threshold,

                "wallet_address"

            ]

            .astype(str)

            .tolist()

        )



        for wallet in high_frequency_wallets:


            if wallet not in wallet_signals:

                wallet_signals[
                    wallet
                ] = []


            wallet_signals[
                wallet
            ].append(
                "交易频率处于前10%"
            )




    # =====================================================
    # 风险钱包：
    # 至少命中两个异常信号
    # =====================================================


    potential_risk_wallets = [

        wallet

        for wallet, signals
        in wallet_signals.items()

        if len(
            set(
                signals
            )
        )
        >= 2

    ]



    risk_count = len(
        potential_risk_wallets
    )



    profile[
        "潜在风险钱包数"
    ] = int(
        risk_count
    )



    profile[
        "潜在风险钱包占比"
    ] = (

        round(

            risk_count
            /
            total_users
            *
            100,

            2

        )

        if total_users

        else 0

    )




    # =====================================================
    # 风险信号统计
    # =====================================================


    signal_counter = {}


    for signals in wallet_signals.values():


        for signal in set(
            signals
        ):


            signal_counter[
                signal
            ] = (

                signal_counter.get(
                    signal,
                    0
                )
                +
                1

            )



    profile[
        "风险信号统计"
    ] = signal_counter



    profile[
        "风险判断说明"
    ] = (

        "当前结果属于基于链上行为特征的启发式风险识别，"
        "用于发现需要进一步检查的钱包，不代表已经确认存在 Sybil 攻击。"
    )



    return profile



# =========================================================
# 用户价值画像
# =========================================================

def build_value_profile(
    users,
    transactions
):

    users_df = _safe_dataframe(
        users
    )

    total_users = len(
        users_df
    )

    profile = {

        "分析类型":
        "用户价值分析",

        "用户总数":
        int(total_users)

    }


    if users_df.empty:

        return profile


    # =========================
    # 平均用户价值分
    # =========================

    if "value_score" in users_df.columns:

        value_scores = pd.to_numeric(

            users_df[
                "value_score"
            ],

            errors="coerce"

        ).fillna(0)


        profile[
            "平均用户价值分"
        ] = round(

            value_scores.mean(),

            2

        )


    # =========================
    # 用户价值分层
    # =========================

    if "value_level" in users_df.columns:

        value_counts = (

            users_df[
                "value_level"
            ]
            .value_counts()
            .to_dict()

        )


        high_value_users = int(

            value_counts.get(
                "高价值用户",
                0
            )

        )


        profile[
            "高价值用户数"
        ] = high_value_users


        profile[
            "高价值用户占比"
        ] = (

            round(

                high_value_users
                /
                total_users
                *
                100,

                2

            )

            if total_users

            else 0

        )


        profile[
            "价值分层分布"
        ] = {

            str(key):
            int(value)

            for key, value
            in value_counts.items()

        }


    # =========================
    # 用户交易价值
    # =========================

    if "total_volume" in users_df.columns:

        total_volume = pd.to_numeric(

            users_df[
                "total_volume"
            ],

            errors="coerce"

        ).fillna(0)


        profile[
            "平均钱包交易价值"
        ] = round(

            total_volume.mean(),

            2

        )


    if "transaction_count" in users_df.columns:

        transaction_count = pd.to_numeric(

            users_df[
                "transaction_count"
            ],

            errors="coerce"

        ).fillna(0)


        profile[
            "平均钱包交易次数"
        ] = round(

            transaction_count.mean(),

            2

        )


    return profile

# =========================================================
# 统一 Profile Engine
# =========================================================


def build_analysis_profile(
    analysis_type,
    users,
    transactions
):


    if analysis_type == "growth":


        return build_growth_profile(

            users,

            transactions

        )



    if analysis_type == "retention":


        return build_retention_profile(

            users,

            transactions

        )



    if analysis_type == "sybil":


        return build_sybil_profile(

            users,

            transactions

        )

    if analysis_type == "value":


        return build_value_profile(

            users,

            transactions

        )



    raise ValueError(

        f"Unsupported analysis type: {analysis_type}"

    )