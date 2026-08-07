from __future__ import annotations

import pandas as pd



def calculate_growth_metrics(
    wallet_profile: pd.DataFrame
):
    """
    Calculate growth metrics
    from wallet-level user profile.
    """


    total_users = len(wallet_profile)


    total_transactions = int(
        wallet_profile["transaction_count"]
        .sum()
    )


    total_volume_usd = float(
        wallet_profile["total_volume_usd"]
        .sum()
    )


    # Active users
    active_users = int(
        (
            wallet_profile["transaction_count"]
            >= 3
        )
        .sum()
    )


    # Repeat users
    repeat_users = int(
        (
            wallet_profile["transaction_count"]
            > 1
        )
        .sum()
    )


    repeat_rate = (
        repeat_users / total_users
        if total_users > 0
        else 0
    )


    metrics = {

        "total_users": total_users,

        "total_transactions": total_transactions,

        "total_volume_usd": round(
            total_volume_usd,
            2
        ),

        "active_users": active_users,

        "repeat_users": repeat_users,

        "repeat_rate": round(
            repeat_rate,
            4
        )

    }


    return metrics