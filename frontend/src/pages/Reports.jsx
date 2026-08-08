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
    getReports
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







    function loadReports(){



        const address = getWallet();




        if(!address){


            return;


        }





        setWallet(address);





        const localReports =

        getReports(address);





        setReports(
            localReports
        );



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


                        {
                            reports.length
                        }


                    </strong>




                </div>




            </div>









            <div className="report-list">



                {


                reports.length===0

                ?

                (

                    <div className="report-item glass-card">


                        暂无分析报告



                    </div>


                )


                :



                reports.map(

                    (report,index)=>(



                        <div


                            className="report-item glass-card"


                            key={

                                report.id
                                ||
                                index

                            }



                        >




                            <h3>


                                分析报告 {index+1}



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


                                    report.file?.filename

                                    ||

                                    report.filename

                                    ||

                                    "用户上传数据"


                                }



                            </p>








                            <p>


                                分析时间：

                                {


                                    report.created_at

                                    ||

                                    report.time

                                    ||

                                    report.createdAt


                                }



                            </p>







                            <button


                                onClick={()=>{


                                    navigate(

                                        `/report/${report.id}`

                                    );


                                }}



                            >


                                查看报告



                            </button>






                        </div>


                    )


                )



                }



            </div>







        </div>


    );



}



export default Reports;