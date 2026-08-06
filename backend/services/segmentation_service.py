from __future__ import annotations

import pandas as pd



def segment_users(
    wallet_profile: pd.DataFrame
):
    """
    Segment wallet users based on
    transaction behavior.
    """


    dataframe = wallet_profile.copy()


    # 时间转换

    dataframe["last_transaction_time"] = (
        pd.to_datetime(
            dataframe["last_transaction_time"]
        )
    )


    # 默认标签

    dataframe["segment"] = (
        "New User"
    )


    # ====================
    # High Value User
    # ====================

    high_value_threshold = (
        dataframe["total_volume_usd"]
        .quantile(0.8)
    )


    high_value_mask = (
        dataframe["total_volume_usd"]
        >= high_value_threshold
    )


    dataframe.loc[
        high_value_mask,
        "segment"
    ] = "High Value User"



    # ====================
    # At Risk User
    # ====================

    latest_time = (
        dataframe["last_transaction_time"]
        .max()
    )


    inactive_days = (
        latest_time
        -
        dataframe["last_transaction_time"]
    ).dt.days


    at_risk_mask = (
        (inactive_days > 30)
        &
        (dataframe["transaction_count"] > 1)
    )


    dataframe.loc[
        at_risk_mask,
        "segment"
    ] = "At Risk User"



    # ====================
    # Active User
    # ====================

    active_mask = (
        dataframe["transaction_count"]
        >= 3
    )


    dataframe.loc[
        active_mask,
        "segment"
    ] = "Active User"



    # ====================
    # 保证 High Value 优先级最高
    # ====================

    dataframe.loc[
        high_value_mask,
        "segment"
    ] = "High Value User"



    return dataframe