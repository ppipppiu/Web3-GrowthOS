from __future__ import annotations

import pandas as pd
import re


# Web3 GrowthOS Mini Demo v0.1
# 链上交易数据必需字段

REQUIRED_COLUMNS = [
    "wallet_address",
    "transaction_hash",
    "block_time",
    "action_type",
    "amount_usd",
]

VALID_TRANSACTION_STATUS = {
    "success",
    "failed",
}


def validate_required_columns(
    dataframe: pd.DataFrame,
) -> dict:
    """
    检查 CSV 是否包含所有必需字段。

    参数:
        dataframe:
            pandas DataFrame

    返回:
        校验结果字典
    """

    missing_columns = [
        column
        for column in REQUIRED_COLUMNS
        if column not in dataframe.columns
    ]

    return {
        "passed": len(missing_columns) == 0,
        "missing_columns": missing_columns,
    }

def validate_missing_values(
    dataframe: pd.DataFrame,
) -> dict:
    """
    检查必需字段中的缺失值。

    参数:
        dataframe:
            pandas DataFrame

    返回:
        缺失值检查结果
    """

    missing_values = {}

    for column in REQUIRED_COLUMNS:

        if column in dataframe.columns:
            missing_values[column] = int(
                dataframe[column]
                .isna()
                .sum()
            )

    has_missing_values = any(
        count > 0
        for count in missing_values.values()
    )

    return {
        "passed": not has_missing_values,
        "missing_values": missing_values,
    }


def validate_duplicate_transactions(
    dataframe: pd.DataFrame,
) -> dict:
    """
    检查 transaction_hash 是否存在重复。

    参数:
        dataframe:
            pandas DataFrame

    返回:
        重复交易检查结果
    """

    if "transaction_hash" not in dataframe.columns:
        return {
            "passed": False,
            "duplicate_transaction_hash": None,
            "message": "transaction_hash column is missing."
        }

    duplicate_count = int(
        dataframe["transaction_hash"]
        .duplicated()
        .sum()
    )

    return {
        "passed": duplicate_count == 0,
        "duplicate_transaction_hash": duplicate_count,
    }


def validate_block_time(
    dataframe: pd.DataFrame,
) -> dict:
    """
    检查 block_time 是否可以正确解析为时间格式。

    参数:
        dataframe:
            pandas DataFrame

    返回:
        时间格式检查结果
    """

    if "block_time" not in dataframe.columns:
        return {
            "passed": False,
            "invalid_block_time": None,
            "message": "block_time column is missing."
        }

    parsed_time = pd.to_datetime(
        dataframe["block_time"],
        errors="coerce"
    )

    invalid_count = int(
        parsed_time.isna()
        .sum()
    )

    return {
        "passed": invalid_count == 0,
        "invalid_block_time": invalid_count,
    }


def validate_amount(
    dataframe: pd.DataFrame,
) -> dict:
    """
    检查 amount_usd 是否为有效金额。

    检查:
    1. 是否可以转换为数字
    2. 是否存在负数

    返回:
        金额检查结果
    """

    if "amount_usd" not in dataframe.columns:
        return {
            "passed": False,
            "invalid_amount": None,
            "negative_amount": None,
            "message": "amount_usd column is missing."
        }

    numeric_amount = pd.to_numeric(
        dataframe["amount_usd"],
        errors="coerce"
    )

    invalid_amount_count = int(
        numeric_amount.isna()
        .sum()
    )

    negative_amount_count = int(
        (numeric_amount < 0)
        .sum()
    )

    return {
        "passed": (
            invalid_amount_count == 0
            and negative_amount_count == 0
        ),
        "invalid_amount": invalid_amount_count,
        "negative_amount": negative_amount_count,
    }


def validate_wallet_address(
    dataframe: pd.DataFrame,
) -> dict:
    """
    检查 wallet_address 是否符合 EVM 地址格式。

    格式要求:
    - 0x 开头
    - 总长度42
    - 后续40位为hex字符

    返回:
        钱包地址检查结果
    """

    if "wallet_address" not in dataframe.columns:
        return {
            "passed": False,
            "invalid_wallet_address": None,
            "message": "wallet_address column is missing."
        }

    pattern = r"^0x[a-fA-F0-9]{40}$"

    invalid_count = int(
        dataframe["wallet_address"]
        .apply(
            lambda x: False
            if isinstance(x, str)
            and re.match(pattern, x)
            else True
        )
        .sum()
    )

    return {
        "passed": invalid_count == 0,
        "invalid_wallet_address": invalid_count,
    }

def validate_transaction_status(
    dataframe: pd.DataFrame,
) -> dict:
    """
    检查 transaction_status 是否为合法状态。

    合法状态:
    success
    failed
    """

    if "transaction_status" not in dataframe.columns:
        return {
            "passed": False,
            "invalid_status": None,
            "message": "transaction_status column is missing."
        }


    invalid_status_count = int(
        (
            ~dataframe["transaction_status"]
            .isin(VALID_TRANSACTION_STATUS)
        )
        .sum()
    )


    return {
        "passed": invalid_status_count == 0,
        "invalid_status": invalid_status_count,
    }