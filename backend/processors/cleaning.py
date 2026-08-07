import pandas as pd


REQUIRED_FIELDS = [
    "wallet_address",
    "event_type",
    "timestamp"
]


def clean_events(df: pd.DataFrame):
    """
    Clean standardized Web3 events.

    Input:
        Raw Event DataFrame

    Output:
        Clean Event DataFrame
        Cleaning Report
    """


    report = {}

    # 原始数量

    report["original_rows"] = len(df)


    clean_df = df.copy()


    # --------------------------------
    # 1. 删除完全重复事件
    # --------------------------------

    before = len(clean_df)


    clean_df = clean_df.drop_duplicates()


    report["duplicate_removed"] = (
        before - len(clean_df)
    )


    # --------------------------------
    # 2. 删除关键字段缺失
    # --------------------------------

    before = len(clean_df)


    clean_df = clean_df.dropna(
        subset=REQUIRED_FIELDS
    )


    report["missing_removed"] = (
        before - len(clean_df)
    )


    # --------------------------------
    # 3. 时间格式转换
    # --------------------------------

    clean_df["timestamp"] = pd.to_datetime(
        clean_df["timestamp"],
        errors="coerce"
    )


    before = len(clean_df)


    clean_df = clean_df.dropna(
        subset=["timestamp"]
    )


    report["invalid_timestamp_removed"] = (
        before - len(clean_df)
    )


    # --------------------------------
    # 4. value 数值处理
    # --------------------------------


    if "value" in clean_df.columns:

        clean_df["value"] = pd.to_numeric(
            clean_df["value"],
            errors="coerce"
        )


    # --------------------------------
    # 5. 添加clean flag
    # --------------------------------

    clean_df["cleaned_flag"] = True


    report["clean_rows"] = len(clean_df)


    report["removed_rows"] = (
        report["original_rows"]
        -
        report["clean_rows"]
    )


    return clean_df, report