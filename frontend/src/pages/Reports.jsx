import { apiUrl } from "../api/config";
import {
    useEffect,
    useState
} from "react";


import {
    useNavigate
} from "react-router-dom";


import {
    getWallet
} from "../blockchain/wallet";


import {
    getReports,
    deleteReportIndex
} from "../utils/reportStorage";


function Reports(){

    const navigate = useNavigate();


    const [
        reports,
        setReports
    ] = useState([]);


    const [
        wallet,
        setWallet
    ] = useState("");


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    const [
        deletingId,
        setDeletingId
    ] = useState(null);


    async function loadReports(){

        const address = getWallet();


        if(!address){

            setWallet("");
            setReports([]);
            setError("请先连接钱包");
            setLoading(false);

            return;

        }


        setWallet(address);
        setLoading(true);
        setError("");


        try{

            // ---------------------------------------------
            // 后端才是历史报告的真实数据源。
            // localStorage 只用于补充 txHash 等轻量链上信息。
            // ---------------------------------------------

            const response = await fetch(
                apiUrl(`/api/reports/${encodeURIComponent(
                    address
                )}`)
            );


            const data = await response.json();


            if(!response.ok){

                throw new Error(
                    data.message
                    ||
                    data.error
                    ||
                    "历史报告读取失败"
                );

            }


            const backendReports =
                Array.isArray(data.reports)
                ? data.reports
                : [];


            const localIndexes =
                getReports(address);


            const mergedReports =
                backendReports.map(
                    backendReport => {

                        const reportId =
                            backendReport.report_id
                            ||
                            backendReport.reportId;


                        const localIndex =
                            localIndexes.find(
                                item =>
                                    item.reportId === reportId
                            );


                        return {
                            ...backendReport,

                            reportId:
                                reportId,

                            txHash:
                                localIndex?.txHash
                                ||
                                backendReport.txHash
                                ||
                                backendReport.tx_hash
                                ||
                                null,

                            filename:
                                backendReport.filename
                                ||
                                backendReport.file?.filename
                                ||
                                localIndex?.filename
                                ||
                                null
                        };

                    }
                );


            setReports(
                mergedReports
            );

        }
        catch(fetchError){

            console.error(
                "历史报告列表读取失败:",
                fetchError
            );


            setReports([]);

            setError(
                fetchError.message
                ||
                "历史报告读取失败"
            );

        }
        finally{

            setLoading(false);

        }

    }


    async function handleDelete(
        report
    ){

        const reportId =
            report.reportId
            ||
            report.report_id;


        if(!reportId){

            alert("当前报告缺少 reportId，无法删除。");

            return;

        }


        const confirmed = window.confirm(
            `确定删除这份历史报告吗？\n\n${report.filename || "用户上传数据"}\n\n删除后无法恢复。`
        );


        if(!confirmed){
            return;
        }


        setDeletingId(
            reportId
        );


        try{

            const response = await fetch(
                apiUrl(`/api/reports/${encodeURIComponent(
                    wallet
                )}/${encodeURIComponent(
                    reportId
                )}`),
                {
                    method: "DELETE"
                }
            );


            const data = await response.json();


            if(
                !response.ok
                ||
                !data.success
            ){

                throw new Error(
                    data.message
                    ||
                    data.error
                    ||
                    "删除报告失败"
                );

            }


            // 后端文件删除成功后，再删除浏览器轻量索引。
            deleteReportIndex(
                wallet,
                reportId
            );


            setReports(
                currentReports =>
                    currentReports.filter(
                        item =>
                            (
                                item.reportId
                                ||
                                item.report_id
                            ) !== reportId
                    )
            );

        }
        catch(deleteError){

            console.error(
                "删除历史报告失败:",
                deleteError
            );


            alert(
                deleteError.message
                ||
                "删除历史报告失败"
            );

        }
        finally{

            setDeletingId(null);

        }

    }


    useEffect(()=>{

        loadReports();

    },[]);


    return (

        <div className="page page-reports">

            <h1 className="page-title">
                我的分析报告
            </h1>


            <div className="profile-panel glass-card">

                <div className="profile-row">

                    <span>
                        当前钱包
                    </span>

                    <strong>
                        {
                            wallet
                            ?
                            wallet.slice(0,6)
                            +
                            "..."
                            +
                            wallet.slice(-4)
                            :
                            "未连接"
                        }
                    </strong>

                </div>


                <div className="profile-row">

                    <span>
                        历史报告数量
                    </span>

                    <strong>
                        {reports.length}
                    </strong>

                </div>

            </div>


            <div className="report-list reports-grid">

                {
                    loading
                    ?
                    (
                        <div className="report-item report-card report-card-status glass-card">
                            正在读取历史报告...
                        </div>
                    )
                    :
                    error
                    ?
                    (
                        <div className="report-item report-card report-card-status glass-card">
                            {error}
                        </div>
                    )
                    :
                    reports.length === 0
                    ?
                    (
                        <div className="report-item report-card report-card-status glass-card">
                            暂无分析报告
                        </div>
                    )
                    :
                    reports.map(
                        (report,index)=>(

                            <div
                                className="report-item report-card glass-card"
                                key={
                                    report.reportId
                                    ||
                                    report.report_id
                                    ||
                                    index
                                }
                            >

                                <h3>
                                    分析报告 {reports.length - index}
                                </h3>


                                <p>
                                    类型：
                                    {
                                        report.type
                                        ||
                                        "链上增长分析"
                                    }
                                </p>


                                <p>
                                    文件：
                                    {
                                        report.filename
                                        ||
                                        report.file?.filename
                                        ||
                                        "用户上传数据"
                                    }
                                </p>


                                <p>
                                    分析时间：
                                    {
                                        report.created_at
                                        ||
                                        "未知"
                                    }
                                </p>


                                <p>
                                    交易 Hash：
                                    {
                                        report.txHash
                                        ?
                                        `${report.txHash.slice(0,10)}...${report.txHash.slice(-8)}`
                                        :
                                        "暂无"
                                    }
                                </p>


                                <div className="report-actions">

                                    <button
                                        onClick={()=>{

                                            const reportId =
                                                report.reportId
                                                ||
                                                report.report_id;

                                            navigate(
                                                `/report/${encodeURIComponent(
                                                    reportId
                                                )}`
                                            );

                                        }}
                                    >
                                        查看报告
                                    </button>


                                    <button
                                        className="report-delete-button"
                                        disabled={
                                            deletingId ===
                                            (
                                                report.reportId
                                                ||
                                                report.report_id
                                            )
                                        }
                                        onClick={()=>
                                            handleDelete(report)
                                        }
                                    >
                                        {
                                            deletingId ===
                                            (
                                                report.reportId
                                                ||
                                                report.report_id
                                            )
                                            ?
                                            "删除中..."
                                            :
                                            "删除"
                                        }
                                    </button>

                                </div>

                            </div>

                        )
                    )
                }

            </div>

        </div>

    );

}


export default Reports;
