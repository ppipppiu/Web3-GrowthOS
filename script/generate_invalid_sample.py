from __future__ import annotations

from pathlib import Path

import pandas as pd


def main() -> None:
    """
    基于正常模拟数据生成一份故意包含异常记录的 CSV，
    用于测试后端的数据校验与清洗逻辑。
    """

    # 获取项目根目录。
    project_root = Path(__file__).resolve().parents[1]

    input_path = (
        project_root
        / "Data"
        / "sample_onchain_transactions.csv"
    )

    output_path = (
        project_root
        / "Data"
        / "invalid_sample.csv"
    )

    if not input_path.exists():
        raise FileNotFoundError(
            f"正常数据文件不存在：{input_path}"
        )

    # 读取正常数据。
    source_df = pd.read_csv(input_path)

    if len(source_df) < 20:
        raise ValueError(
            "正常数据至少需要 20 行，才能生成异常测试数据。"
        )

    # 取前 20 行作为基础测试数据。
    invalid_df = source_df.head(20).copy()

    # -----------------------------------------------------
    # 1. 空钱包地址
    # -----------------------------------------------------
    invalid_df.loc[0, "wallet_address"] = ""

    # -----------------------------------------------------
    # 2. 空交易哈希
    # -----------------------------------------------------
    invalid_df.loc[1, "transaction_hash"] = ""

    # -----------------------------------------------------
    # 3. 重复交易哈希
    # 将第 3 行的交易哈希改成第 2 行相同的值。
    # -----------------------------------------------------
    invalid_df.loc[
        2,
        "transaction_hash",
    ] = invalid_df.loc[3, "transaction_hash"]

    # -----------------------------------------------------
    # 4. 错误时间格式
    # -----------------------------------------------------
    invalid_df.loc[4, "block_time"] = "not-a-valid-time"

    # -----------------------------------------------------
    # 5. 空金额
    # -----------------------------------------------------
    invalid_df.loc[5, "amount_usd"] = ""

    # -----------------------------------------------------
    # 6. 非数字金额
    # -----------------------------------------------------
    invalid_df.loc[6, "amount_usd"] = "abc"

    # -----------------------------------------------------
    # 7. 负数金额
    # -----------------------------------------------------
    invalid_df.loc[7, "amount_usd"] = -100

    # -----------------------------------------------------
    # 8. 零金额
    # 这类记录可以保留，但后端应返回 warning。
    # -----------------------------------------------------
    invalid_df.loc[8, "amount_usd"] = 0

    # -----------------------------------------------------
    # 9. 失败交易
    # 失败交易不应进入核心指标计算。
    # -----------------------------------------------------
    invalid_df.loc[
        9,
        "transaction_status",
    ] = "failed"

    # -----------------------------------------------------
    # 10. 非标准钱包地址
    # -----------------------------------------------------
    invalid_df.loc[
        10,
        "wallet_address",
    ] = "0x1234"

    # -----------------------------------------------------
    # 11. 非标准交易哈希
    # -----------------------------------------------------
    invalid_df.loc[
        11,
        "transaction_hash",
    ] = "0xabc"

    # -----------------------------------------------------
    # 12. 空 action_type
    # action_type 是必填字段。
    # -----------------------------------------------------
    invalid_df.loc[
        12,
        "action_type",
    ] = ""

    # -----------------------------------------------------
    # 13. 不支持的 action_type
    # -----------------------------------------------------
    invalid_df.loc[
        13,
        "action_type",
    ] = "unknown_action"

    # -----------------------------------------------------
    # 14. 无效交易状态
    # -----------------------------------------------------
    invalid_df.loc[
        14,
        "transaction_status",
    ] = "pending"

    # -----------------------------------------------------
    # 15. 空 token_symbol
    # token_symbol 是可选字段，因此后端不应停止分析。
    # -----------------------------------------------------
    invalid_df.loc[
        15,
        "token_symbol",
    ] = ""

    # -----------------------------------------------------
    # 16. 无效 gas_fee_usd
    # -----------------------------------------------------
    invalid_df.loc[
        16,
        "gas_fee_usd",
    ] = "invalid-gas"

    # -----------------------------------------------------
    # 17. 负数 gas_fee_usd
    # -----------------------------------------------------
    invalid_df.loc[
        17,
        "gas_fee_usd",
    ] = -0.5

    # -----------------------------------------------------
    # 18. 空白记录
    # 创建一整行空值。
    # -----------------------------------------------------
    blank_row = {
        column: ""
        for column in invalid_df.columns
    }

    # -----------------------------------------------------
    # 19. 完全重复行
    # 复制最后一条正常记录。
    # -----------------------------------------------------
    duplicate_row = invalid_df.iloc[19].copy()

    # 将空白行和重复行加入数据。
    invalid_df = pd.concat(
        [
            invalid_df,
            pd.DataFrame([blank_row]),
            pd.DataFrame([duplicate_row]),
        ],
        ignore_index=True,
    )

    # 保存异常测试数据。
    invalid_df.to_csv(
        output_path,
        index=False,
    )

    print("Invalid sample generated successfully.")
    print("-" * 50)
    print(f"Input rows: {len(source_df)}")
    print(f"Output rows: {len(invalid_df)}")
    print(f"Saved to: {output_path}")
    print("-" * 50)

    print("\nInjected test cases:")
    print("1. Empty wallet address")
    print("2. Empty transaction hash")
    print("3. Duplicate transaction hash")
    print("4. Invalid block time")
    print("5. Empty amount_usd")
    print("6. Non-numeric amount_usd")
    print("7. Negative amount_usd")
    print("8. Zero amount_usd")
    print("9. Failed transaction")
    print("10. Invalid wallet address format")
    print("11. Invalid transaction hash format")
    print("12. Empty action_type")
    print("13. Unsupported action_type")
    print("14. Invalid transaction_status")
    print("15. Empty optional token_symbol")
    print("16. Invalid gas_fee_usd")
    print("17. Negative gas_fee_usd")
    print("18. Blank row")
    print("19. Fully duplicated row")


if __name__ == "__main__":
    main()