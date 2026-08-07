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








function Dashboard(){


    const navigate = useNavigate();



    const [

        dashboardData,

        setDashboardData

    ] = useState(null);







    async function loadDashboard(){



        const result =

        localStorage.getItem(

            "analysis_result"

        );



        if(!result){

            return;

        }



        const analysisResult =

        JSON.parse(result);




        try{


            const response =

            await fetch(

                "http://localhost:8000/api/dashboard",

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



            const data =

            await response.json();




            setDashboardData(data);



        }

        catch(error){


            console.error(

                error

            );


        }


    }







    useEffect(()=>{


        loadDashboard();


    },[]);







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







    // 用户价值分布


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







        {/* =====================
            核心指标
        ===================== */}



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
                        ? `${Number(item[1]).toLocaleString()} USD`
                        : item[1]
                }

                </div>


            </div>


            )


        )


        }


        </div>


        </section>









        {/* =====================
            增长分析中心
        ===================== */}





        <section>


        <h2 className="section-title">

            增长分析中心

        </h2>





        <div className="analysis-center-grid">


        {


        [

            {


                title:"用户价值分析",

                desc:"分析高价值用户画像及价值来源",

                path:"value"


            },


            {


                title:"用户增长分析",

                desc:"分析用户增长趋势和增长瓶颈",

                path:"growth"


            },


            {


                title:"用户留存分析",

                desc:"分析用户持续参与行为",

                path:"retention"


            },


            {


                title:"Sybil风险分析",

                desc:"识别异常钱包行为",

                path:"sybil"


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

                onClick={()=>navigate(

                    `/growth/${item.path}`

                )}

                >

                    开始分析

                </button>



            </div>


        ))


        }



        </div>


        </section>









        {/* =====================
            趋势
        ===================== */}




        <section>


        <h2 className="section-title">

            用户增长趋势

        </h2>




        <GrowthTrendChart

        data={

            dashboardData.trend?.length

            ?

            dashboardData.trend

            :

            generateTrendData(users)

        }

        />


        </section>









        {/* =====================
            漏斗
        ===================== */}



        <section>


        <h2 className="section-title">

            用户增长漏斗

        </h2>




        <FunnelChart

        data={funnelData}

        />


        </section>









        {/* =====================
            用户价值
        ===================== */}




        <section>


        <h2 className="section-title">

            用户价值分布

        </h2>



        <ValueChart

        data={valueDistribution}

        />


        </section>





    </div>


    );


}



export default Dashboard;