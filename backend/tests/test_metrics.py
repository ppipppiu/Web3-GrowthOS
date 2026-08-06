import pandas as pd

from backend.app.services.wallet_aggregation_service import (
    aggregate_wallet_profile
)

from backend.app.services.metrics_service import (
    calculate_growth_metrics
)



def test_metrics():


    df = pd.read_csv(
        "Data/clean_transactions.csv"
    )


    wallet_profile = (
        aggregate_wallet_profile(df)
    )


    metrics = (
        calculate_growth_metrics(
            wallet_profile
        )
    )


    print("\nGrowth Metrics:")
    print(metrics)


    assert "total_users" in metrics

    assert "repeat_rate" in metrics

    assert metrics["total_users"] > 0



if __name__ == "__main__":

    test_metrics()