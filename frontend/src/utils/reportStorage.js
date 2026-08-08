// =========================================================
// 用户报告本地索引存储
//
// 浏览器只保存轻量索引：
// reportId / txHash / filename / created_at / type
// 完整报告统一由后端 backend/reportdata 保存。
// =========================================================

const STORAGE_KEY = "growth_reports";


function readStorage() {

    try {

        return (
            JSON.parse(
                localStorage.getItem(
                    STORAGE_KEY
                )
            )
            ||
            {}
        );

    }
    catch (error) {

        console.warn(
            "读取历史报告索引失败，已使用空索引:",
            error
        );

        return {};

    }

}


function compactReport(
    report = {},
    fallbackId = null
) {

    const nestedReport =
        report.report
        &&
        typeof report.report === "object"
        ? report.report
        : {};


    const filename =
        report.filename
        ||
        report.file?.filename
        ||
        nestedReport.file?.filename
        ||
        null;


    const reportId =
        report.reportId
        ||
        report.report_id
        ||
        nestedReport.report_id
        ||
        null;


    return {

        id:
            report.id
            ||
            fallbackId
            ||
            Date.now(),

        created_at:
            report.created_at
            ||
            report.time
            ||
            report.createdAt
            ||
            new Date().toLocaleString(),

        type:
            report.type
            ||
            "dashboard",

        reportId:
            reportId,

        txHash:
            report.txHash
            ||
            report.tx_hash
            ||
            null,

        filename:
            filename,

        file:
            filename
            ? {
                filename
            }
            : null

    };

}


function compactStorage(
    storage = {}
) {

    const compacted = {};


    Object.entries(storage).forEach(
        ([wallet, reports]) => {

            if (!Array.isArray(reports)) {

                compacted[wallet] = [];

                return;

            }


            compacted[wallet] = reports.map(
                (report, index) =>
                    compactReport(
                        report,
                        `${wallet}-${index}`
                    )
            );

        }
    );


    return compacted;

}


function writeStorage(
    storage
) {

    const compacted = compactStorage(
        storage
    );


    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(compacted)
        );

    }
    catch (error) {

        // 兼容旧版本把完整报告写满 localStorage 的情况。
        // 删除旧大对象后，只重新写入压缩后的轻量索引。
        console.warn(
            "历史报告索引空间不足，正在清理旧版完整报告缓存:",
            error
        );


        localStorage.removeItem(
            STORAGE_KEY
        );


        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(compacted)
        );

    }


    return compacted;

}


export function saveReport(
    wallet,
    report
) {

    if (!wallet) {
        return;
    }


    const storage = compactStorage(
        readStorage()
    );


    if (!storage[wallet]) {
        storage[wallet] = [];
    }


    const newReport = compactReport(
        report,
        Date.now()
    );


    // 同一个 reportId 不重复写入。
    const existingIndex =
        storage[wallet].findIndex(
            item =>
                item.reportId
                &&
                item.reportId === newReport.reportId
        );


    if (existingIndex >= 0) {

        storage[wallet][existingIndex] = {
            ...storage[wallet][existingIndex],
            ...newReport
        };

    }
    else {

        storage[wallet].push(
            newReport
        );

    }


    writeStorage(
        storage
    );

}


export function getReports(
    wallet
) {

    if (!wallet) {
        return [];
    }


    const storage = writeStorage(
        readStorage()
    );


    const reports =
        storage[wallet]
        ||
        [];


    return [...reports].sort(
        (a, b) => {

            const timeA =
                Date.parse(a.created_at || "")
                ||
                Number(a.id || 0)
                ||
                0;

            const timeB =
                Date.parse(b.created_at || "")
                ||
                Number(b.id || 0)
                ||
                0;

            return timeB - timeA;

        }
    );

}


export function getReportMeta(
    wallet,
    reportId
) {

    if (
        !wallet
        ||
        !reportId
    ) {
        return null;
    }


    const reports = getReports(
        wallet
    );


    return (
        reports.find(
            report =>
                report.reportId === reportId
                ||
                String(report.id) === String(reportId)
        )
        ||
        null
    );

}


export function deleteReportIndex(
    wallet,
    reportId
) {

    if (
        !wallet
        ||
        !reportId
    ) {
        return;
    }


    const storage = compactStorage(
        readStorage()
    );


    const reports =
        storage[wallet]
        ||
        [];


    storage[wallet] = reports.filter(
        report =>
            report.reportId !== reportId
            &&
            String(report.id) !== String(reportId)
    );


    writeStorage(
        storage
    );

}
