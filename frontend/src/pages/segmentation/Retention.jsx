import { useEffect, useState } from "react";


function Retention(){


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
                        暂无用户留存分析数据
                    </h2>


                    <p>
                        请先上传链上交易数据并完成分析。
                    </p>


                </div>


            </div>

        );


    }






    const now =
        new Date();





    /*
        用户留存状态计算

        根据最近一次链上行为时间

        <=30天 活跃

        30-60天 稳定

        60-90天 沉默

        >90天 风险

    */


    const retentionUsers =


        users.map(user=>{


            const lastActivity =

                new Date(
                    user.last_activity
                );



            const inactiveDays =


                Math.floor(

                    (
                        now -
                        lastActivity

                    )

                    /
                    (
                        1000 *
                        60 *
                        60 *
                        24
                    )

                );





            let status =
                "流失风险用户";



            if(
                inactiveDays <= 30
            ){

                status =
                "活跃用户";


            }

            else if(
                inactiveDays <= 60
            ){

                status =
                "稳定用户";


            }

            else if(
                inactiveDays <= 90
            ){

                status =
                "沉默用户";

            }





            return {

                ...user,

                inactiveDays,

                status

            };


        });









    const statusList = [


        {

            name:"活跃用户",

            key:"活跃用户",

            strategy:
            "生态任务、社区权益、长期激励"

        },


        {

            name:"稳定用户",

            key:"稳定用户",

            strategy:
            "提升交易频率、活动运营"

        },


        {

            name:"沉默用户",

            key:"沉默用户",

            strategy:
            "召回活动、交易提醒"

        },


        {

            name:"流失风险用户",

            key:"流失风险用户",

            strategy:
            "强激励召回、专项运营"

        }


    ];








    const summary = {


        active:

            retentionUsers.filter(

                user=>
                user.status==="活跃用户"

            ).length,



        stable:

            retentionUsers.filter(

                user=>
                user.status==="稳定用户"

            ).length,



        silent:

            retentionUsers.filter(

                user=>
                user.status==="沉默用户"

            ).length,



        risk:

            retentionUsers.filter(

                user=>
                user.status==="流失风险用户"

            ).length


    };







    const riskUsers =

        retentionUsers

        .filter(

            user=>

            user.status==="流失风险用户"

        );







    return (

        <div className="page page-segmentation">





            <div className="glass-panel info-card">


                <div className="page-title">

                    用户留存分析

                </div>



                <p>

                    基于钱包最近活跃时间，
                    分析用户持续使用情况，
                    识别沉默和流失风险用户。

                </p>


            </div>









            {/* 留存概览 */}



            <div className="section-title">

                用户留存概览

            </div>




            <div className="retention-kpi-grid">



                <div className="glass-card retention-kpi">

                    <h3>
                        活跃用户
                    </h3>

                    <p>
                        {summary.active}
                    </p>

                </div>




                <div className="glass-card retention-kpi">

                    <h3>
                        稳定用户
                    </h3>

                    <p>
                        {summary.stable}
                    </p>

                </div>




                <div className="glass-card retention-kpi">

                    <h3>
                        沉默用户
                    </h3>

                    <p>
                        {summary.silent}
                    </p>

                </div>




                <div className="glass-card retention-kpi">

                    <h3>
                        风险用户
                    </h3>

                    <p>
                        {summary.risk}
                    </p>

                </div>


            </div>









            {/* 留存分层 */}



            <div className="section-title">

                用户留存状态分层

            </div>






            <div className="retention-grid">


            {


            statusList.map(item=>{


                const count =

                    retentionUsers.filter(

                        user=>

                        user.status===item.key

                    ).length;



                return (

                    <div

                    className="glass-card retention-card"

                    key={item.key}

                    >


                        <h3>

                            {item.name}

                        </h3>



                        <div className="retention-number">

                            {count}

                        </div>



                        <p>

                            占比：

                            {

                            (

                            count /
                            retentionUsers.length *
                            100

                            )

                            .toFixed(1)

                            }%

                        </p>



                        <p>

                            策略：

                            {item.strategy}

                        </p>



                    </div>

                );


            })


            }


            </div>









            {/* 风险画像 */}



            <div className="section-title">

                流失风险用户画像

            </div>





            <div className="glass-card retention-profile">


                <h3>

                    风险特征

                </h3>



                <ul>


                    <li>

                        长时间未发生链上交易

                    </li>



                    <li>

                        用户活跃周期缩短

                    </li>



                    <li>

                        交易频率下降

                    </li>



                    <li>

                        需要重点召回

                    </li>


                </ul>


                <p>

                    当前风险钱包数量：

                    <strong>

                        {riskUsers.length}

                    </strong>

                </p>



            </div>








            {/* 策略 */}



            <div className="section-title">

                留存增长策略

            </div>




            <div className="glass-card retention-strategy">


                <ul>

                    <li>
                        对沉默用户发送召回任务
                    </li>


                    <li>
                        对稳定用户提升交易频率
                    </li>


                    <li>
                        对活跃用户提供长期生态权益
                    </li>

                </ul>



            </div>






        </div>

    );


}



export default Retention;