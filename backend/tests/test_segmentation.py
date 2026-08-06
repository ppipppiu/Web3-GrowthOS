import pandas as pd


from backend.app.services.wallet_aggregation_service import (
    aggregate_wallet_profile
)


from backend.app.services.segmentation_service import (
    segment_users
)



def test_segmentation():


    # 读取清洗数据

    df = pd.read_csv(
        "Data/clean_transactions.csv"
    )


    # 用户聚合

    wallet_profile = (
        aggregate_wallet_profile(df)
    )


    # 用户分层

    segmented_profile = (
        segment_users(
            wallet_profile
        )
    )


    print(
        "\nSegment Result:"
    )


    print(
        segmented_profile[
            [
                "wallet_address",
                "transaction_count",
                "total_volume_usd",
                "segment"
            ]
        ]
        .head(10)
    )


    print(
        "\nSegment Count:"
    )


    print(
        segmented_profile[
            "segment"
        ]
        .value_counts()
    )


    # 基础检查

    assert "segment" in segmented_profile.columns

    assert len(segmented_profile) > 0



if __name__ == "__main__":

    test_segmentation()