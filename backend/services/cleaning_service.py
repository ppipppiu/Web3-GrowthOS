from __future__ import annotations

import pandas as pd


CRITICAL_COLUMNS = [
    "wallet_address",
    "transaction_hash",
    "block_time",
    "amount_usd",
]


def remove_duplicate_transactions(
    dataframe: pd.DataFrame,
):
    """
    删除重复交易。

    根据 transaction_hash 判断重复。
    """

    dataframe = dataframe.copy()

    before = len(dataframe)

    duplicate_mask = (
        dataframe["transaction_hash"]
        .duplicated(
            keep="first"
        )
    )

    removed_count = int(
        duplicate_mask.sum()
    )

    dataframe = dataframe[
        ~duplicate_mask
    ]

    return dataframe, removed_count



def remove_missing_critical_values(
    dataframe: pd.DataFrame,
):
    """
    删除关键字段为空的数据。
    """

    dataframe = dataframe.copy()

    before = len(dataframe)

    missing_mask = (
        dataframe[CRITICAL_COLUMNS]
        .isnull()
        .any(axis=1)
    )

    removed_count = int(
        missing_mask.sum()
    )

    dataframe = dataframe[
        ~missing_mask
    ]

    return dataframe, removed_count



def normalize_data_types(
    dataframe: pd.DataFrame,
):
    """
    数据类型标准化。
    """

    dataframe = dataframe.copy()


    # block_time 转换
    original_time = dataframe["block_time"].copy()

    dataframe["block_time"] = pd.to_datetime(
        dataframe["block_time"],
        errors="coerce"
    )


    invalid_time_mask = (
        pd.to_datetime(
            original_time,
            errors="coerce"
        ).isna()
    )

    dataframe.loc[
        invalid_time_mask,
        "cleaning_notes"
    ] += "block_time_normalized;"


    # amount_usd 转换
    original_amount = dataframe["amount_usd"].copy()

    dataframe["amount_usd"] = pd.to_numeric(
        dataframe["amount_usd"],
        errors="coerce"
    )


    invalid_amount_mask = (
        pd.to_numeric(
            original_amount,
            errors="coerce"
        ).isna()
    )

    dataframe.loc[
        invalid_amount_mask,
        "cleaning_notes"
    ] += "amount_converted_to_float;"


    return dataframe



def initialize_cleaning_columns(
    dataframe: pd.DataFrame,
):
    """
    创建清洗记录字段。
    """

    dataframe = dataframe.copy()

    dataframe["cleaned_flag"] = 0

    dataframe["cleaning_notes"] = ""

    return dataframe



def clean_transactions(
    dataframe: pd.DataFrame,
):
    """
    完整数据清洗流程。

    返回:
        clean_dataframe
        cleaning_report
    """

    dataframe = initialize_cleaning_columns(
        dataframe
    )


    original_rows = len(dataframe)


    report = {

        "original_rows": original_rows,

        "duplicate_removed": 0,

        "missing_value_removed": 0,

        "modified_rows": 0,

    }


    # ====================
    # 1. 删除重复交易
    # ====================

    dataframe, duplicate_removed = (
        remove_duplicate_transactions(
            dataframe
        )
    )

    report[
        "duplicate_removed"
    ] = duplicate_removed


    # ====================
    # 2. 删除关键字段为空
    # ====================

    dataframe, missing_removed = (
        remove_missing_critical_values(
            dataframe
        )
    )

    report[
        "missing_value_removed"
    ] = missing_removed



    # ====================
    # 3. 类型转换
    # ====================

    before_notes = (
        dataframe["cleaning_notes"]
        .copy()
    )


    dataframe = normalize_data_types(
        dataframe
    )


    modified_count = int(
        (
            dataframe["cleaning_notes"]
            != before_notes
        )
        .sum()
    )


    dataframe.loc[
        dataframe["cleaning_notes"] != "",
        "cleaned_flag"
    ] = 1


    report[
        "modified_rows"
    ] = modified_count



    # ====================
    # 4. 清洗结果
    # ====================

    report[
        "clean_rows"
    ] = len(dataframe)


    report[
        "removed_rows"
    ] = (
        original_rows
        -
        len(dataframe)
    )


    return {

        "clean_dataframe": dataframe,

        "cleaning_report": report

    }