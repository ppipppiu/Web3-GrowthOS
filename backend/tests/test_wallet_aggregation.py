import pandas as pd

from backend.app.services.wallet_aggregation_service import (
    aggregate_wallet_profile
)


def test_wallet_aggregation():

    # 读取清洗后的数据
    df = pd.read_csv(
        "Data/clean_transactions.csv"
    )


    # 用户聚合
    wallet_profile = aggregate_wallet_profile(
        df
    )


    print("\nWallet Profile:")
    print(
        wallet_profile.head()
    )


    print("\nUsers:")
    print(
        len(wallet_profile)
    )


    # 基础断言

    assert "wallet_address" in wallet_profile.columns

    assert "transaction_count" in wallet_profile.columns

    assert "total_volume_usd" in wallet_profile.columns

    assert len(wallet_profile) > 0



if __name__ == "__main__":

    test_wallet_aggregation()