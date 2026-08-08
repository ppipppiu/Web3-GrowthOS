import pandas as pd


def calculate_distribution(profiles):
    """
    Calculate metric distribution from wallet-level profiles.

    Input:
        profiles:
        wallet-level dataframe

    Output:
        metric percentile distribution
    """

    distribution = {}

    # 不同项目可能字段名称不同
    metric_mapping = {

        "transaction_value": [
            "total_value",
            "total_volume",
            "total_volume_usd"
        ],

        "transaction_count": [
            "total_events",
            "transaction_count",
            "tx_count"
        ],

        "active_days": [
            "active_days"
        ],

        "wallet_age": [
            "wallet_age"
        ],

        "contract_interactions": [
            "contract_interactions"
        ]

    }


    for metric_name, possible_columns in metric_mapping.items():

        column = None


        # 自动寻找存在字段
        for col in possible_columns:

            if col in profiles.columns:
                column = col
                break


        # 当前数据不存在该指标，跳过
        if column is None:
            continue


        values = pd.to_numeric(
            profiles[column],
            errors="coerce"
        ).dropna()


        if len(values) == 0:
            continue


        distribution[metric_name] = {

            "field": column,

            "count": int(values.count()),

            "min": float(values.min()),

            "p25": float(values.quantile(0.25)),

            "p50": float(values.quantile(0.50)),

            "p75": float(values.quantile(0.75)),

            "p90": float(values.quantile(0.90)),

            "max": float(values.max()),

            "mean": float(values.mean())

        }


    return distribution