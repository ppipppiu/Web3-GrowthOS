from __future__ import annotations

import pandas as pd



def aggregate_wallet_profile(
    dataframe: pd.DataFrame
):
    """
    Convert transaction-level data
    into wallet-level user profiles.
    """

    dataframe = dataframe.copy()


    # 确保时间格式
    dataframe["block_time"] = pd.to_datetime(
        dataframe["block_time"]
    )


    wallet_profile = (
        dataframe
        .groupby("wallet_address")
        .agg(

            transaction_count=(
                "transaction_hash",
                "count"
            ),

            total_volume_usd=(
                "amount_usd",
                "sum"
            ),

            avg_transaction_amount=(
                "amount_usd",
                "mean"
            ),

            active_days=(
                "block_time",
                lambda x: x.dt.date.nunique()
            ),

            first_transaction_time=(
                "block_time",
                "min"
            ),

            last_transaction_time=(
                "block_time",
                "max"
            ),

        )
        .reset_index()
    )


    # 行为类型

    action_profile = (
        dataframe
        .groupby("wallet_address")
        ["action_type"]
        .apply(
            lambda x:
            ",".join(
                sorted(
                    x.unique()
                )
            )
        )
        .reset_index(
            name="action_types"
        )
    )


    wallet_profile = wallet_profile.merge(
        action_profile,
        on="wallet_address",
        how="left"
    )


    return wallet_profile