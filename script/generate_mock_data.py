from __future__ import annotations

import hashlib
import random
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pandas as pd


# ---------------------------------------------------------
# 1. 基础配置
# ---------------------------------------------------------

RANDOM_SEED = 42

# 模拟数据的最后一天。
# 后续分析会以数据中的最大 block_time 作为分析基准时间。
REFERENCE_TIME = datetime(
    year=2026,
    month=7,
    day=20,
    hour=23,
    minute=59,
    second=59,
    tzinfo=timezone.utc,
)

# 钱包行为类型及数量，总计 100 个钱包。
WALLET_GROUPS = {
    "new": 15,
    "active": 25,
    "high_frequency": 10,
    "high_value": 10,
    "churn_risk": 20,
    "low_frequency": 20,
}

TOKEN_SYMBOLS = ["USDC", "USDT", "MON", "WETH"]
ACTION_TYPES = ["swap", "add_liquidity", "remove_liquidity"]


# ---------------------------------------------------------
# 2. 工具函数
# ---------------------------------------------------------

def generate_hex_string(length: int, rng: random.Random) -> str:
    """
    生成指定长度的十六进制字符串。

    参数：
        length: 字符串长度。
        rng: 固定随机种子的随机数生成器。
    """
    characters = "0123456789abcdef"
    return "".join(rng.choice(characters) for _ in range(length))


def generate_wallet_address(index: int) -> str:
    """
    根据钱包序号生成稳定且格式合法的钱包地址。

    Ethereum 风格钱包地址：
    0x + 40 位十六进制字符。
    """
    source = f"web3-growthos-wallet-{index}"
    digest = hashlib.sha256(source.encode("utf-8")).hexdigest()
    return f"0x{digest[:40]}"


def generate_transaction_hash(
    wallet_address: str,
    transaction_index: int,
    block_time: datetime,
) -> str:
    """
    根据钱包地址、交易序号和交易时间生成稳定且唯一的交易哈希。

    Ethereum 风格交易哈希：
    0x + 64 位十六进制字符。
    """
    source = (
        f"{wallet_address}-"
        f"{transaction_index}-"
        f"{block_time.isoformat()}"
    )
    digest = hashlib.sha256(source.encode("utf-8")).hexdigest()
    return f"0x{digest}"


def random_datetime_between(
    start_time: datetime,
    end_time: datetime,
    rng: random.Random,
) -> datetime:
    """
    在两个时间点之间随机生成一个 UTC 时间。

    start_time 和 end_time 必须包含时区信息。
    """
    if start_time > end_time:
        raise ValueError("start_time cannot be later than end_time")

    total_seconds = int((end_time - start_time).total_seconds())
    random_seconds = rng.randint(0, total_seconds)

    return start_time + timedelta(seconds=random_seconds)


def choose_action_type(rng: random.Random) -> str:
    """
    生成交易行为类型。

    为了更符合 DEX 场景，大部分行为设为 swap。
    """
    return rng.choices(
        population=ACTION_TYPES,
        weights=[0.85, 0.10, 0.05],
        k=1,
    )[0]


def choose_token_symbol(rng: random.Random) -> str:
    """随机选择交易涉及的 Token。"""
    return rng.choice(TOKEN_SYMBOLS)


def generate_amount(
    wallet_group: str,
    rng: random.Random,
) -> float:
    """
    根据钱包行为类型生成不同范围的交易金额。
    """
    amount_ranges = {
        "new": (5, 150),
        "active": (20, 400),
        "high_frequency": (10, 250),
        "high_value": (500, 3000),
        "churn_risk": (20, 500),
        "low_frequency": (5, 120),
    }

    minimum, maximum = amount_ranges[wallet_group]

    return round(rng.uniform(minimum, maximum), 2)


def generate_gas_fee(rng: random.Random) -> float:
    """生成简单的模拟 Gas 成本。"""
    return round(rng.uniform(0.001, 0.08), 4)


# ---------------------------------------------------------
# 3. 钱包交易行为生成
# ---------------------------------------------------------

def generate_transaction_times(
    wallet_group: str,
    rng: random.Random,
) -> list[datetime]:
    """
    根据钱包类型生成交易次数和交易时间。

    各钱包组的设计逻辑：

    new:
        首次交易在最近 7 天，通常 1～2 笔。

    active:
        最近 30 天至少 3 笔，历史还可能有额外交易。

    high_frequency:
        交易次数很多，最近 30 天仍然活跃。

    high_value:
        金额较高，时间可覆盖整个 90 天。

    churn_risk:
        历史至少 2 笔，但最近 30 天没有交易。

    low_frequency:
        交易次数少，分散在过去 90 天。
    """
    period_start = REFERENCE_TIME - timedelta(days=89)
    recent_30d_start = REFERENCE_TIME - timedelta(days=29)
    recent_7d_start = REFERENCE_TIME - timedelta(days=6)
    before_recent_30d_end = REFERENCE_TIME - timedelta(days=30)

    if wallet_group == "new":
        transaction_count = rng.randint(1, 2)

        first_time = random_datetime_between(
            recent_7d_start,
            REFERENCE_TIME,
            rng,
        )

        times = [first_time]

        for _ in range(transaction_count - 1):
            times.append(
                random_datetime_between(
                    first_time,
                    REFERENCE_TIME,
                    rng,
                )
            )

    elif wallet_group == "active":
        recent_transaction_count = rng.randint(3, 7)
        historical_transaction_count = rng.randint(0, 3)

        times = [
            random_datetime_between(
                recent_30d_start,
                REFERENCE_TIME,
                rng,
            )
            for _ in range(recent_transaction_count)
        ]

        times.extend(
            random_datetime_between(
                period_start,
                recent_30d_start - timedelta(seconds=1),
                rng,
            )
            for _ in range(historical_transaction_count)
        )

    elif wallet_group == "high_frequency":
        recent_transaction_count = rng.randint(6, 12)
        historical_transaction_count = rng.randint(4, 10)

        times = [
            random_datetime_between(
                recent_30d_start,
                REFERENCE_TIME,
                rng,
            )
            for _ in range(recent_transaction_count)
        ]

        times.extend(
            random_datetime_between(
                period_start,
                recent_30d_start - timedelta(seconds=1),
                rng,
            )
            for _ in range(historical_transaction_count)
        )

    elif wallet_group == "high_value":
        transaction_count = rng.randint(3, 8)

        times = [
            random_datetime_between(
                period_start,
                REFERENCE_TIME,
                rng,
            )
            for _ in range(transaction_count)
        ]

        # 确保部分高价值钱包最近 30 天仍然活跃。
        if rng.random() < 0.7:
            times.append(
                random_datetime_between(
                    recent_30d_start,
                    REFERENCE_TIME,
                    rng,
                )
            )

    elif wallet_group == "churn_risk":
        transaction_count = rng.randint(2, 7)

        times = [
            random_datetime_between(
                period_start,
                before_recent_30d_end,
                rng,
            )
            for _ in range(transaction_count)
        ]

    elif wallet_group == "low_frequency":
        transaction_count = rng.randint(1, 2)

        times = [
            random_datetime_between(
                period_start,
                REFERENCE_TIME,
                rng,
            )
            for _ in range(transaction_count)
        ]

    else:
        raise ValueError(f"Unsupported wallet group: {wallet_group}")

    return sorted(times)


def build_transactions() -> pd.DataFrame:
    """
    生成完整的模拟交易 DataFrame。
    """
    rng = random.Random(RANDOM_SEED)

    records: list[dict[str, object]] = []
    wallet_index = 1

    for wallet_group, wallet_count in WALLET_GROUPS.items():
        for _ in range(wallet_count):
            wallet_address = generate_wallet_address(wallet_index)
            wallet_index += 1

            transaction_times = generate_transaction_times(
                wallet_group=wallet_group,
                rng=rng,
            )

            for transaction_index, block_time in enumerate(
                transaction_times,
                start=1,
            ):
                transaction_hash = generate_transaction_hash(
                    wallet_address=wallet_address,
                    transaction_index=transaction_index,
                    block_time=block_time,
                )

                records.append(
                    {
                        "wallet_address": wallet_address,
                        "transaction_hash": transaction_hash,
                        "block_time": block_time.isoformat().replace(
                            "+00:00",
                            "Z",
                        ),
                        "action_type": choose_action_type(rng),
                        "amount_usd": generate_amount(
                            wallet_group=wallet_group,
                            rng=rng,
                        ),
                        "token_symbol": choose_token_symbol(rng),
                        "gas_fee_usd": generate_gas_fee(rng),
                        "transaction_status": "success",
                    }
                )

    dataframe = pd.DataFrame(records)

    # 按交易时间排序，便于人工查看。
    dataframe["block_time"] = pd.to_datetime(
        dataframe["block_time"],
        utc=True,
    )

    dataframe = dataframe.sort_values(
        by=["block_time", "wallet_address"],
        ascending=[True, True],
    ).reset_index(drop=True)

    # 保存时转换回 ISO 8601 字符串。
    dataframe["block_time"] = dataframe["block_time"].dt.strftime(
        "%Y-%m-%dT%H:%M:%SZ"
    )

    return dataframe


# ---------------------------------------------------------
# 4. 数据检查
# ---------------------------------------------------------

def validate_generated_data(dataframe: pd.DataFrame) -> None:
    """
    对生成的数据进行基础检查。

    如果数据不符合要求，直接抛出异常，避免保存错误文件。
    """
    required_columns = {
        "wallet_address",
        "transaction_hash",
        "block_time",
        "action_type",
        "amount_usd",
        "token_symbol",
        "gas_fee_usd",
        "transaction_status",
    }

    missing_columns = required_columns - set(dataframe.columns)

    if missing_columns:
        raise ValueError(
            f"Generated data is missing columns: {sorted(missing_columns)}"
        )

    unique_wallets = dataframe["wallet_address"].nunique()
    duplicate_hashes = dataframe["transaction_hash"].duplicated().sum()

    if unique_wallets != sum(WALLET_GROUPS.values()):
        raise ValueError(
            f"Expected {sum(WALLET_GROUPS.values())} wallets, "
            f"but generated {unique_wallets}"
        )

    if duplicate_hashes > 0:
        raise ValueError(
            f"Generated data contains {duplicate_hashes} duplicate hashes"
        )

    if (dataframe["amount_usd"] < 0).any():
        raise ValueError("Generated data contains negative amount_usd")

    if not dataframe["wallet_address"].str.match(
        r"^0x[a-f0-9]{40}$"
    ).all():
        raise ValueError("Generated data contains invalid wallet addresses")

    if not dataframe["transaction_hash"].str.match(
        r"^0x[a-f0-9]{64}$"
    ).all():
        raise ValueError(
            "Generated data contains invalid transaction hashes"
        )


def print_summary(dataframe: pd.DataFrame) -> None:
    """
    在终端输出数据摘要，方便人工检查。
    """
    parsed_times = pd.to_datetime(
        dataframe["block_time"],
        utc=True,
    )

    wallet_summary = (
        dataframe.groupby("wallet_address")
        .agg(
            first_transaction_time=("block_time", "min"),
            last_transaction_time=("block_time", "max"),
            total_transactions=("transaction_hash", "count"),
            total_volume_usd=("amount_usd", "sum"),
        )
        .reset_index()
    )

    wallet_summary["first_transaction_time"] = pd.to_datetime(
        wallet_summary["first_transaction_time"],
        utc=True,
    )

    wallet_summary["last_transaction_time"] = pd.to_datetime(
        wallet_summary["last_transaction_time"],
        utc=True,
    )

    recent_7d_start = REFERENCE_TIME - timedelta(days=6)
    recent_30d_start = REFERENCE_TIME - timedelta(days=29)

    new_wallets = (
        wallet_summary["first_transaction_time"] >= recent_7d_start
    ).sum()

    recent_30d_transactions = dataframe[
        parsed_times >= recent_30d_start
    ]

    active_counts = (
        recent_30d_transactions.groupby("wallet_address")
        .size()
    )

    active_wallets = (active_counts >= 3).sum()

    churn_risk_wallets = (
        (wallet_summary["total_transactions"] >= 2)
        & (
            wallet_summary["last_transaction_time"]
            < recent_30d_start
        )
    ).sum()

    high_value_wallet_count = max(
        1,
        round(len(wallet_summary) * 0.2),
    )

    print("\nGenerated data summary")
    print("-" * 40)
    print(f"Rows: {len(dataframe)}")
    print(f"Unique wallets: {dataframe['wallet_address'].nunique()}")
    print(f"Start time: {parsed_times.min()}")
    print(f"End time: {parsed_times.max()}")
    print(f"New wallets in recent 7 days: {new_wallets}")
    print(f"Active wallets in recent 30 days: {active_wallets}")
    print(f"High-value wallet target count: {high_value_wallet_count}")
    print(f"Churn-risk wallets: {churn_risk_wallets}")
    print(
        f"Total volume USD: "
        f"{dataframe['amount_usd'].sum():,.2f}"
    )
    print("-" * 40)


# ---------------------------------------------------------
# 5. 程序入口
# ---------------------------------------------------------

def main() -> None:
    """
    生成模拟数据并保存到指定目录。
    """
    output_directory = Path(r"D:\Web3-GrowthOS\Data")
    output_directory.mkdir(parents=True, exist_ok=True)

    output_path = (
        output_directory
        / "sample_onchain_transactions.csv"
    )

    dataframe = build_transactions()
    validate_generated_data(dataframe)
    dataframe.to_csv(output_path, index=False, encoding="utf-8-sig")

    print_summary(dataframe)
    print(f"\nCSV saved to: {output_path}")


if __name__ == "__main__":
    main()