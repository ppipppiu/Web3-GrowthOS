import os
import json

from datetime import datetime



REPORT_DIR = "storage/reports"





def get_wallet_dir(wallet_address: str):

    """
    获取钱包对应的报告目录
    """

    path = os.path.join(
        REPORT_DIR,
        wallet_address.lower()
    )


    os.makedirs(
        path,
        exist_ok=True
    )


    return path







def save_report(
    wallet_address: str,
    report_data: dict
):

    """
    保存用户分析报告
    """


    folder = get_wallet_dir(
        wallet_address
    )



    now = datetime.now()


    report_id = (
        "report_"
        +
        now.strftime(
            "%Y%m%d_%H%M%S"
        )
    )



    report = {

        "report_id":
            report_id,


        "wallet_address":
            wallet_address,


        "created_at":
            now.strftime(
                "%Y-%m-%d %H:%M:%S"
            ),


        **report_data

    }



    file_path = os.path.join(

        folder,

        f"{report_id}.json"

    )



    with open(

        file_path,

        "w",

        encoding="utf-8"

    ) as f:


        json.dump(

            report,

            f,

            ensure_ascii=False,

            indent=4

        )



    return report







def get_reports(
    wallet_address:str
):

    """
    获取钱包历史报告
    """


    folder = get_wallet_dir(

        wallet_address

    )



    reports = []



    for file in os.listdir(folder):


        if file.endswith(".json"):


            with open(

                os.path.join(

                    folder,

                    file

                ),

                "r",

                encoding="utf-8"

            ) as f:


                reports.append(

                    json.load(f)

                )





    reports.sort(

        key=lambda x:

        x.get(
            "created_at",
            ""
        ),

        reverse=True

    )


    return reports







def get_profile(
    wallet_address:str
):


    reports = get_reports(

        wallet_address

    )


    return {


        "wallet_address":

        wallet_address,



        "report_count":

        len(reports),



        "last_analysis_time":


        reports[0]["created_at"]

        if reports

        else None


    }