import { apiUrl } from "../api/config";
import {
    useEffect,
    useState
} from "react";


import {
    useNavigate
} from "react-router-dom";


import GrowthTrendChart
from "../components/charts/GrowthTrendChart";


import FunnelChart
from "../components/charts/FunnelChart";


import ValueChart
from "../components/charts/ValueChart";





function generateTrendData(users){


    if(
        !users ||
        users.length===0
    ){

        return [];

    }



    return users.map(

        (user,index)=>(

            {

                date:
                user.first_transaction
                ||
                `Day ${index+1}`,


                transactions:
                user.transaction_count
                ||
                0,


                volume:
                user.total_volume
                ||
                0

            }

        )

    );


}








function Dashboard({
    data=null
}){



    const navigate = useNavigate();



    const [
        dashboardData,
        setDashboardData
    ] = useState(null);



    const [
        expandedChart,
        setExpandedChart
    ] = useState(null);







    async function loadDashboard(){


        let analysisResult;



        // ==========================
        // 历史报告进入
        // ==========================

        if(data){


            analysisResult = data;


        }



        // ==========================
        // 正常分析进入
        // ==========================

        else{


            const result =

            localStorage.getItem(
                "analysis_result"
            );



            if(!result){

                return;

            }



            analysisResult =

            JSON.parse(result);


        }







        try{


            const response =

            await fetch(

                apiUrl("/api/dashboard"),

                {


                    method:"POST",


                    headers:{


                        "Content-Type":

                        "application/json"


                    },


                    body:JSON.stringify({

                        users:

                        analysisResult.users || [],



                        transactions:

                        analysisResult.transactions || [],



                        value_model:


                        JSON.parse(

                            localStorage.getItem(
                                "value_model"
                            )

                        )

                        ||

                        {

                            weights:{

                                volume:50,

                                activity:30,

                                transaction:20

                            }

                        }


                    })

                }

            );



            const result =

            await response.json();



            setDashboardData(result);



        }

        catch(error){


            console.error(

                "Dashboard加载失败:",
                error

            );


        }


    }







    useEffect(()=>{


        loadDashboard();


    },[data]);



    useEffect(()=>{


        if(!expandedChart){

            return;

        }


        const previousOverflow =
        document.body.style.overflow;


        const handleKeyDown = (event)=>{

            if(event.key === "Escape"){

                setExpandedChart(null);

            }

        };


        document.body.style.overflow = "hidden";

        window.addEventListener(
            "keydown",
            handleKeyDown
        );


        return ()=>{

            document.body.style.overflow = previousOverflow;

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };


    },[expandedChart]);







    if(!dashboardData){


        return (

            <div className="page-container">


                <div className="glass-card">


                    暂无分析数据，请先上传数据


                </div>


            </div>

        );

    }







    const users =

    dashboardData.users || [];







    const overview =

    dashboardData.overview || {};







    const valueDistribution =


    users.reduce(

        (result,user)=>{


            const level =

            user.value_level ||

            "普通用户";



            const exist =

            result.find(

                item=>

                item.name===level

            );



            if(exist){


                exist.value +=1;


            }

            else{


                result.push({


                    name:level,


                    value:1


                });


            }



            return result;



        },

        []

    );







    const funnelData =

    dashboardData.funnel?.conversion

    ||

    [];









    return (

    <div className="page-container">





        <h1 className="page-title">

            增长数据看板

        </h1>




        <p className="page-description">

            基于链上用户行为分析，帮助项目发现增长机会

        </p>





        <section>


        <h2 className="section-title">

            增长概览

        </h2>





        <div className="dashboard-grid">


        {


        [

            [
            "钱包用户",

            overview["钱包数量"]
            ||
            users.length

            ],


            [

            "交易数量",

            overview["交易数量"]
            ||
            0

            ],


            [

            "交易价值",

            overview["交易价值"]
            ||
            0

            ],


            [

            "用户数量",

            users.length

            ]



        ]

        .map(

            item=>(


            <div

            className="metric-card glass-card"

            key={item[0]}

            >


                <div className="metric-title">

                    {item[0]}

                </div>


                <div className="metric-value">

                {
                    item[0] === "交易价值"
                    ?
                    `${Number(item[1]).toLocaleString()} USD`
                    :
                    item[1]

                }

                </div>


            </div>


            )


        )


        }


        </div>


        </section>









        <section>


        <h2 className="section-title">

            分析中心

        </h2>


        <div className="analysis-center-grid">


        {


        [
            {
                title:"用户激活分析",
                desc:"分析新用户完成首次链上行为比例",
                path:"/segmentation/activation"
            },


            {
                title:"用户价值分析",
                desc:"识别高价值用户及价值来源",
                path:"/segmentation/value-analysis"
            },


            {
                title:"用户留存分析",
                desc:"分析用户持续参与行为",
                path:"/segmentation/retention"
            },


            {
                title:"Sybil风险检测",
                desc:"识别异常钱包和机器人行为",
                path:"/segmentation/sybil-detection"
            }


        ]

        .map(item=>(


            <div

            className="analysis-card glass-card"

            key={item.title}

            >


                <h3>

                {item.title}

                </h3>



                <p>

                {item.desc}

                </p>




                <button

                className="primary-button"

                onClick={()=>navigate(item.path)}

                >

                    开始分析

                </button>



            </div>


        ))


        }



        </div>


        </section>









        <section>


        <h2 className="section-title">

            核心增长分析

        </h2>



        <div className="dashboard-insight-grid">


            <div
            className={`dashboard-chart-preview glass-card ${expandedChart === "trend" ? "is-expanded" : ""}`}
            data-chart-title="用户增长趋势"
            role="button"
            tabIndex={0}
            onClick={()=>setExpandedChart("trend")}
            onKeyDown={(event)=>{

                if(
                    event.key === "Enter"
                    ||
                    event.key === " "
                ){

                    event.preventDefault();
                    setExpandedChart("trend");

                }

            }}
            >

                <GrowthTrendChart
                data={

                    dashboardData.trend?.length
                    ?
                    dashboardData.trend
                    :
                    generateTrendData(users)

                }
                expanded={expandedChart === "trend"}
                />

            </div>



            <div
            className={`dashboard-chart-preview glass-card ${expandedChart === "funnel" ? "is-expanded" : ""}`}
            data-chart-title="用户增长漏斗"
            role="button"
            tabIndex={0}
            onClick={()=>setExpandedChart("funnel")}
            onKeyDown={(event)=>{

                if(
                    event.key === "Enter"
                    ||
                    event.key === " "
                ){

                    event.preventDefault();
                    setExpandedChart("funnel");

                }

            }}
            >

                <FunnelChart
                data={funnelData}
                />

            </div>



            <div
            className={`dashboard-chart-preview glass-card ${expandedChart === "value" ? "is-expanded" : ""}`}
            data-chart-title="用户价值分布"
            role="button"
            tabIndex={0}
            onClick={()=>setExpandedChart("value")}
            onKeyDown={(event)=>{

                if(
                    event.key === "Enter"
                    ||
                    event.key === " "
                ){

                    event.preventDefault();
                    setExpandedChart("value");

                }

            }}
            >

                <ValueChart
                data={valueDistribution}
                />

            </div>


        </div>


        </section>



        {
            expandedChart
            &&
            <div
            className="chart-modal-backdrop"
            onClick={()=>setExpandedChart(null)}
            aria-hidden="true"
            />
        }





    </div>


    );


}



export default Dashboard;