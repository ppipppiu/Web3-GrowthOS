import { apiUrl } from "../api/config";
import React, {
    useEffect,
    useState
} from "react";


import {
    useParams
} from "react-router-dom";


import {
    getReportMeta
} from "../utils/reportStorage";


import {
    getWallet
} from "../blockchain/wallet";


import Dashboard from "./Dashboard";


export default function ReportDetail(){

    const {
        id
    } = useParams();


    const [
        report,
        setReport
    ] = useState(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    useEffect(()=>{

        async function loadReport(){

            const wallet = getWallet();


            if(!wallet){

                setError(
                    "请先连接钱包"
                );

                setLoading(false);

                return;

            }


            // 新版本 URL 直接使用 report_id。
            // 同时兼容旧版本 /report/:localId：
            // 如果 localStorage 能找到对应索引，则转换为真正 reportId。
            const localMeta =
                getReportMeta(
                    wallet,
                    id
                );


            const reportId =
                localMeta?.reportId
                ||
                id;


            try{

                const response = await fetch(
                    apiUrl(`/api/reports/${encodeURIComponent(
                        wallet
                    )}/${encodeURIComponent(
                        reportId
                    )}`)
                );


                const data = await response.json();


                if(
                    !response.ok
                    ||
                    !data.success
                    ||
                    !data.report
                ){

                    throw new Error(
                        data.message
                        ||
                        data.error
                        ||
                        "未找到指定历史报告"
                    );

                }


                const backendReport =
                    data.report;


                const exactLocalMeta =
                    getReportMeta(
                        wallet,
                        backendReport.report_id
                    )
                    ||
                    localMeta;


                setReport({

                    ...backendReport,

                    type:
                        exactLocalMeta?.type
                        ||
                        backendReport.type
                        ||
                        "dashboard",

                    txHash:
                        exactLocalMeta?.txHash
                        ||
                        backendReport.txHash
                        ||
                        backendReport.tx_hash
                        ||
                        null,

                    filename:
                        exactLocalMeta?.filename
                        ||
                        backendReport.file?.filename
                        ||
                        null

                });

            }
            catch(fetchError){

                console.error(
                    "历史报告读取失败:",
                    fetchError
                );


                setError(
                    fetchError.message
                    ||
                    "未找到指定历史报告"
                );

            }
            finally{

                setLoading(false);

            }

        }


        loadReport();

    },[id]);


    if(loading){

        return (

            <div className="page-container">

                <div className="glass-card">
                    正在读取历史报告...
                </div>

            </div>

        );

    }


    if(!report){

        return (

            <div className="page-container">

                <div className="glass-card">
                    {error || "未找到报告"}
                </div>

            </div>

        );

    }


    return (

        <div className="page-container">

            <h1 className="page-title">
                分析报告详情
            </h1>


            <div className="glass-card">

                <p>
                    类型：
                    {
                        report.type
                        ||
                        "dashboard"
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
                    时间：
                    {
                        report.created_at
                        ||
                        "未知"
                    }
                </p>


                <p>
                    交易Hash：
                    {
                        report.txHash
                        ||
                        "暂无"
                    }
                </p>

            </div>


            <Dashboard
                data={
                    report.analysis
                    ||
                    null
                }
            />

        </div>

    );

}
