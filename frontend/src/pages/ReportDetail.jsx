import React, {
    useEffect,
    useState
} from "react";

import {
    useParams
} from "react-router-dom";


import {
    getReports
} from "../utils/reportStorage";


import Dashboard from "./Dashboard";





export default function ReportDetail(){


    const {
        id
    } = useParams();



    const [
        report,
        setReport
    ] = useState(null);






    useEffect(()=>{


        const wallet =

        localStorage.getItem(
            "walletAddress"
        );



        if(!wallet){

            return;

        }





        const reports =

        getReports(wallet);






        const target =

        reports.find(

            item =>

            String(item.id)
            ===
            String(id)

        );




        setReport(target);



    },[id]);








    if(!report){


        return (

            <div className="page-container">


                <div className="glass-card">


                    未找到报告


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
                    }

                </p>




                <p>

                    时间：

                    {
                        report.created_at
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
                    report.report
                }

            />





        </div>


    );


}