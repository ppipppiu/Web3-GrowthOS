import pandas as pd



def normalize_events(df: pd.DataFrame):
    """
    Convert raw Web3 transaction data
    into standard event format.
    """


    normalized = pd.DataFrame()


    # wallet

    normalized["wallet_address"] = (
        df["wallet_address"]
    )


    # transaction behavior

    normalized["event_type"] = (
        df["action_type"]
    )


    # timestamp

    normalized["timestamp"] = (
        pd.to_datetime(
            df["block_time"],
            errors="coerce"
        )
    )


    # value

    normalized["value"] = (
        pd.to_numeric(
            df["amount_usd"],
            errors="coerce"
        )
    )


    # token

    if "token_symbol" in df.columns:

        normalized["token"] = (
            df["token_symbol"]
        )

    else:

        normalized["token"] = None



    # transaction hash

    if "transaction_hash" in df.columns:

        normalized["tx_hash"] = (
            df["transaction_hash"]
        )



    # status

    if "transaction_status" in df.columns:

        normalized["status"] = (
            df["transaction_status"]
        )


    # source

    normalized["source"] = "demo"


    return normalized