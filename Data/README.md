# Demo Data

This directory contains synthetic transaction data used by Web3 GrowthOS Mini Demo v0.1.

The data simulates DEX wallet transaction behavior over a 90-day period.

It does not contain real users, real wallet activity, or personal information.

## Files

- `sample_onchain_transactions.csv`: Main sample dataset.
- `invalid_sample.csv`: Dataset containing intentionally invalid records for validation testing.

## Required Fields

- `wallet_address`
- `transaction_hash`
- `block_time`
- `action_type`
- `amount_usd`

## Optional Fields

- `token_symbol`
- `gas_fee_usd`
- `transaction_status`

## invalid_sample.csv

This file intentionally contains invalid records for backend validation tests.

The injected issues include:

- Missing wallet addresses
- Missing transaction hashes
- Duplicate transaction hashes
- Invalid timestamps
- Missing or invalid transaction amounts
- Negative and zero transaction amounts
- Failed transactions
- Invalid wallet and transaction hash formats
- Invalid action types
- Invalid transaction statuses
- Blank rows
- Fully duplicated rows

This file must not be used as the primary analytics dataset.
