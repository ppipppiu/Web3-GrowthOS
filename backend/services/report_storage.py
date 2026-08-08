import json
import os
from datetime import datetime


# =========================================================
# 报告存储目录
#
# 无论从项目根目录还是 backend 目录启动 FastAPI，
# 报告都会固定保存在：
#
# backend/reportdata/
# =========================================================

BACKEND_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

REPORT_DIR = os.path.join(
    BACKEND_DIR,
    "reportdata"
)


# 兼容旧版本曾经使用过的相对路径 storage/reports。
# 新报告只写入 backend/reportdata，旧报告仍尽量可读取。
LEGACY_REPORT_DIRS = [
    os.path.abspath("storage/reports"),
    os.path.join(BACKEND_DIR, "storage", "reports"),
]


os.makedirs(
    REPORT_DIR,
    exist_ok=True
)


# =========================================================
# 内部工具
# =========================================================


def _wallet_key(wallet_address: str) -> str:
    """统一钱包目录名称。"""

    return (wallet_address or "unknown").lower()



def get_wallet_dir(wallet_address: str):
    """
    获取钱包对应的新报告目录。

    新报告目录格式：
    backend/reportdata/<wallet_address>/
    """

    path = os.path.join(
        REPORT_DIR,
        _wallet_key(wallet_address)
    )

    os.makedirs(
        path,
        exist_ok=True
    )

    return path



def _candidate_wallet_dirs(wallet_address: str):
    """返回新目录 + 旧目录候选，用于兼容读取。"""

    wallet_key = _wallet_key(wallet_address)

    folders = [
        os.path.join(
            REPORT_DIR,
            wallet_key
        )
    ]

    for base_dir in LEGACY_REPORT_DIRS:
        folders.append(
            os.path.join(
                base_dir,
                wallet_key
            )
        )

    # 去重，避免不同相对路径最终指向同一个目录。
    unique_folders = []
    seen = set()

    for folder in folders:
        normalized = os.path.abspath(folder)

        if normalized in seen:
            continue

        seen.add(normalized)
        unique_folders.append(normalized)

    return unique_folders



def _load_json(file_path: str):
    """安全读取单个 JSON 报告。"""

    try:
        with open(
            file_path,
            "r",
            encoding="utf-8"
        ) as f:
            return json.load(f)

    except (
        OSError,
        json.JSONDecodeError
    ):
        return None


# =========================================================
# 保存报告
# =========================================================


def save_report(
    wallet_address: str,
    report_data: dict
):
    """
    保存用户完整分析报告。

    完整数据只保存在后端：
    backend/reportdata/<wallet>/<report_id>.json
    """

    folder = get_wallet_dir(
        wallet_address
    )

    now = datetime.now()

    report_id = (
        "report_"
        +
        now.strftime(
            "%Y%m%d_%H%M%S_%f"
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


# =========================================================
# 获取单份报告
# =========================================================


def get_report(
    wallet_address: str,
    report_id: str
):
    """
    根据钱包地址 + report_id 获取指定完整历史报告。
    """

    if (
        not wallet_address
        or
        not report_id
    ):
        return None

    for folder in _candidate_wallet_dirs(
        wallet_address
    ):

        file_path = os.path.join(
            folder,
            f"{report_id}.json"
        )

        if not os.path.exists(
            file_path
        ):
            continue

        report = _load_json(
            file_path
        )

        if report:
            return report

    return None


# =========================================================
# 获取历史报告
# =========================================================


def get_reports(
    wallet_address: str
):
    """
    获取钱包历史完整报告。

    该函数继续返回完整报告，保持原有后端 Agent / Profile
    等逻辑兼容；前端历史报告详情则通过 report_id 按需读取。
    """

    reports_by_id = {}

    for folder in _candidate_wallet_dirs(
        wallet_address
    ):

        if not os.path.exists(folder):
            continue

        for file_name in os.listdir(folder):

            if not file_name.endswith(
                ".json"
            ):
                continue

            report = _load_json(
                os.path.join(
                    folder,
                    file_name
                )
            )

            if not report:
                continue

            report_id = (
                report.get(
                    "report_id"
                )
                or
                os.path.splitext(
                    file_name
                )[0]
            )

            # 新目录优先，因为 _candidate_wallet_dirs
            # 先返回 backend/reportdata。
            if report_id not in reports_by_id:
                reports_by_id[
                    report_id
                ] = report

    reports = list(
        reports_by_id.values()
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


# =========================================================
# 用户 Profile
# =========================================================


def get_profile(
    wallet_address: str
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


# =========================================================
# 获取历史报告轻量索引
# =========================================================


def get_report_indexes(
    wallet_address: str
):
    """
    获取钱包历史报告的轻量索引。

    列表页只返回元数据，不返回 analysis/users/transactions 等
    大体积字段，避免前端重新缓存完整报告。
    """

    reports = get_reports(
        wallet_address
    )

    indexes = []

    for report in reports:

        file_info = report.get(
            "file",
            {}
        )

        if not isinstance(
            file_info,
            dict
        ):
            file_info = {}

        indexes.append({
            "report_id":
                report.get(
                    "report_id"
                ),

            "wallet_address":
                report.get(
                    "wallet_address"
                ),

            "created_at":
                report.get(
                    "created_at"
                ),

            "type":
                report.get(
                    "type",
                    "dashboard"
                ),

            "filename":
                file_info.get(
                    "filename"
                ),

            "file": {
                "filename":
                    file_info.get(
                        "filename"
                    )
            },

            "txHash":
                report.get(
                    "txHash"
                )
                or
                report.get(
                    "tx_hash"
                )
        })

    return indexes


# =========================================================
# 删除历史报告
# =========================================================


def delete_report(
    wallet_address: str,
    report_id: str
):
    """
    删除指定钱包下的一份历史报告。

    同时检查新目录 backend/reportdata 和兼容的旧目录，
    防止同一 report_id 残留两份文件。
    """

    if (
        not wallet_address
        or
        not report_id
    ):
        return False

    # 防止 report_id 被当作路径使用。
    if (
        os.path.basename(
            report_id
        )
        !=
        report_id
        or
        "/" in report_id
        or
        "\\" in report_id
    ):
        return False

    deleted = False

    for folder in _candidate_wallet_dirs(
        wallet_address
    ):

        file_path = os.path.join(
            folder,
            f"{report_id}.json"
        )

        if not os.path.exists(
            file_path
        ):
            continue

        try:
            os.remove(
                file_path
            )
            deleted = True

        except OSError:
            continue

    return deleted
