from fastapi import FastAPI, UploadFile, File, HTTPException
import pandas as pd
import os
from io import BytesIO

from fastapi.middleware.cors import CORSMiddleware


from backend.app.services.validation_service import (
    validate_required_columns,
    validate_missing_values,
    validate_duplicate_transactions,
    validate_block_time,
    validate_amount,
    validate_wallet_address,
    validate_transaction_status,
)


from backend.app.services.cleaning_service import (
    clean_transactions,
)


from backend.app.services.wallet_aggregation_service import (
    aggregate_wallet_profile,
)


from backend.app.services.metrics_service import (
    calculate_growth_metrics,
)


from backend.app.services.segmentation_service import (
    segment_users,
)



app = FastAPI(
    title="Web3 GrowthOS API",
    description=(
        "Backend API for Web3 GrowthOS Mini Demo v0.1."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root() -> dict[str, str]:

    return {
        "message": "Web3 GrowthOS API is running."
    }



@app.get("/health")
def health_check() -> dict[str, str]:

    return {
        "status": "ok",
        "service": "web3-growthos-api",
        "version": "0.1.0",
    }




@app.post("/api/analyze")
async def analyze_file(
    file: UploadFile = File(...)
):

    """
    Complete Web3 Growth Intelligence pipeline:

    CSV
     ↓
    Validation
     ↓
    Cleaning
     ↓
    Wallet Aggregation
     ↓
    Metrics
     ↓
    Segmentation
    """


    # =========================
    # 1. Read CSV
    # =========================

    if not file.filename.endswith(".csv"):

        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported."
        )


    content = await file.read()


    try:

        dataframe = pd.read_csv(
            BytesIO(content)
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Cannot read CSV file."
        )



    # =========================
    # 2. Validation
    # =========================


    validation_result = (
        validate_required_columns(
            dataframe
        )
    )


    missing_value_result = (
        validate_missing_values(
            dataframe
        )
    )


    duplicate_result = (
        validate_duplicate_transactions(
            dataframe
        )
    )


    time_result = (
        validate_block_time(
            dataframe
        )
    )


    amount_result = (
        validate_amount(
            dataframe
        )
    )


    wallet_result = (
        validate_wallet_address(
            dataframe
        )
    )


    status_result = (
        validate_transaction_status(
            dataframe
        )
    )



    # =========================
    # 3. Cleaning
    # =========================


    cleaning_result = (
        clean_transactions(
            dataframe
        )
    )


    clean_dataframe = (
        cleaning_result[
            "clean_dataframe"
        ]
    )


    cleaning_report = (
        cleaning_result[
            "cleaning_report"
        ]
    )



    # =========================
    # 4. Wallet Aggregation
    # =========================


    wallet_profile = (
        aggregate_wallet_profile(
            clean_dataframe
        )
    )



    # =========================
    # 5. Metrics
    # =========================


    metrics = (
        calculate_growth_metrics(
            wallet_profile
        )
    )



    # =========================
    # 6. Segmentation
    # =========================


    segmented_profile = (
        segment_users(
            wallet_profile
        )
    )


    segment_summary = (
        segmented_profile[
            "segment"
        ]
        .value_counts()
        .to_dict()
    )



    # =========================
    # 7. Save outputs
    # =========================


    output_dir = r"D:\Web3-GrowthOS\Data"


    os.makedirs(
        output_dir,
        exist_ok=True
    )


    clean_output_path = os.path.join(
        output_dir,
        "clean_transactions.csv"
    )


    wallet_output_path = os.path.join(
        output_dir,
        "wallet_profile.csv"
    )



    clean_dataframe.to_csv(
        clean_output_path,
        index=False
    )


    wallet_profile.to_csv(
        wallet_output_path,
        index=False
    )



    # =========================
    # 8. Response
    # =========================


    return {


        "success": True,


        "file": {

            "filename": file.filename,

            "rows": len(dataframe),

            "columns": list(
                dataframe.columns
            ),

        },


        "validation": {

            "required_columns":
                validation_result,

            "missing_values":
                missing_value_result,

            "duplicates":
                duplicate_result,

            "time":
                time_result,

            "amount":
                amount_result,

            "wallet":
                wallet_result,

            "transaction_status":
                status_result,

        },


        "cleaning": cleaning_report,


        "outputs": {

            "clean_transactions":
                clean_output_path,

            "wallet_profile":
                wallet_output_path,

        },


        "analysis": {


            "metrics":
                metrics,


            "segmentation":
                segment_summary,

        },


        "preview": {


            "wallet_profile":

                wallet_profile
                .head(5)
                .to_dict(
                    orient="records"
                ),


            "segmentation":

                segmented_profile
                .head(5)
                .to_dict(
                    orient="records"
                ),

        }

    }