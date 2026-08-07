import { useEffect, useState } from "react";


function ValueAnalysis(){


    const [
        users,
        setUsers
    ] = useState([]);




    useEffect(()=>{


        const result =

            localStorage.getItem(
                "analysis_result"
            );


        if(result){


            const data =
                JSON.parse(result);



            setUsers(
                data.profiles || []
            );


        }


    },[]);






    if(users.length === 0){


        return (

            <div className="page page-segmentation">


                <div className="glass-panel info-card">


                    <h2>
                        暂无用户价值分析数据
                    </h2>


                    <p>
                        请先上传链上交易数据并完成分析。
                    </p>


                </div>


            </div>

        );

    }





    /*
        RFM指标计算

        R:
        最近活跃时间

        F:
        交易次数

        M:
        交易价值

    */


    const now =
        new Date();




    const scoredUsers =

        users.map(user=>{


            const events =
                user.total_events || 0;


            const value =
                user.total_value || 0;



            const lastActivity =

                new Date(
                    user.last_activity
                );



            const daysInactive =

                Math.floor(

                    (
                        now -
                        lastActivity

                    )

                    /
                    (1000*60*60*24)

                );




            let level =
                "普通用户";



            if(

                events >= 10 &&
                value >= 1000 &&
                daysInactive <= 30

            ){

                level =
                "核心价值用户";


            }

            else if(

                events >= 5 ||
                value >= 500

            ){

                level =
                "潜力用户";


            }


            else if(

                daysInactive > 60

            ){

                level =
                "流失风险用户";

            }





            return {

                ...user,

                daysInactive,

                level

            };


        });








    const summary = {


        total:

            scoredUsers.length,



        highValue:

            scoredUsers.filter(

                user=>
                user.level==="核心价值用户"

            ).length,



        risk:

            scoredUsers.filter(

                user=>
                user.level==="流失风险用户"

            ).length,



        totalValue:

            scoredUsers.reduce(

                (sum,user)=>

                    sum +
                    Number(
                        user.total_value || 0
                    ),

                0

            )

    };







    const levels = [

        {

            name:"核心价值用户",

            key:"核心价值用户",

            strategy:
            "VIP权益、生态奖励、治理参与"

        },


        {

            name:"潜力用户",

            key:"潜力用户",

            strategy:
            "提升交易频率，增加任务激励"

        },


        {

            name:"普通用户",

            key:"普通用户",

            strategy:
            "基础运营，提高活跃"

        },


        {

            name:"流失风险用户",

            key:"流失风险用户",

            strategy:
            "召回活动，重新激活"

        }

    ];






    return (

        <div className="page page-segmentation">





            <div className="glass-panel info-card">


                <div className="page-title">

                    用户价值分析

                </div>



                <p>

                    基于钱包交易频率、
                    交易价值和最近活跃时间，
                    使用 RFM 思路识别高价值用户。

                </p>


            </div>









            {/* KPI */}



            <div className="section-title">

                钱包价值概览

            </div>





            <div className="value-kpi-grid">


                <div className="glass-card value-kpi">


                    <h3>
                        钱包数量
                    </h3>


                    <p>
                        {summary.total}
                    </p>


                </div>




                <div className="glass-card value-kpi">


                    <h3>
                        高价值钱包
                    </h3>


                    <p>
                        {summary.highValue}
                    </p>


                </div>




                <div className="glass-card value-kpi">


                    <h3>
                        交易价值
                    </h3>


                    <p>

                        {
                        summary.totalValue
                        .toLocaleString()
                        }

                    </p>


                    <span>
                        MON
                    </span>


                </div>




                <div className="glass-card value-kpi">


                    <h3>
                        风险钱包
                    </h3>


                    <p>
                        {summary.risk}
                    </p>


                </div>



            </div>









            {/* 分层 */}



            <div className="section-title">

                RFM 用户价值分层

            </div>




            <div className="value-segment-grid">


            {


            levels.map(level=>{


                const count =

                    scoredUsers.filter(

                        user=>

                        user.level===level.key

                    ).length;



                return (

                    <div

                    className="glass-card value-card"

                    key={level.key}

                    >


                        <h3>

                            {level.name}

                        </h3>



                        <div className="value-number">

                            {count}

                        </div>



                        <p>

                            用户占比：

                            {

                            (

                            count /
                            summary.total *
                            100

                            )

                            .toFixed(1)

                            }%

                        </p>



                        <p>

                            策略：

                            {level.strategy}

                        </p>



                    </div>

                );


            })


            }


            </div>









            {/* 用户画像 */}



            <div className="section-title">

                高价值钱包画像

            </div>





            <div className="glass-card value-profile">


                <h3>

                    核心用户特点

                </h3>



                <ul>


                    <li>
                        高频链上交易
                    </li>


                    <li>
                        较高交易价值贡献
                    </li>


                    <li>
                        最近仍保持活跃
                    </li>


                    <li>
                        适合作为生态核心用户运营
                    </li>


                </ul>


            </div>






        </div>


    );


}


export default ValueAnalysis;