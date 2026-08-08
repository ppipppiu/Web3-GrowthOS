import { useEffect, useState } from "react";


function SybilDetection(){


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
                        暂无风险检测数据
                    </h2>


                    <p>
                        请先上传链上交易数据并完成分析。
                    </p>


                </div>


            </div>

        );


    }







    const avgTransactions =


        users.reduce(

            (sum,user)=>

            sum +
            Number(
                user.total_events || 0
            ),

            0

        )
        /
        users.length;







    const riskUsers =


        users.map(user=>{


            const txCount =

                Number(
                    user.total_events || 0
                );


            const value =

                Number(
                    user.total_value || 0
                );



            let risk =
                "正常钱包";



            let reason =
                "行为正常";





            if(

                txCount >
                avgTransactions * 3

                &&
                value < 500

            ){


                risk =
                "高风险钱包";


                reason =
                "高频低价值交易";


            }

            else if(

                txCount >
                avgTransactions * 2

            ){


                risk =
                "可疑钱包";


                reason =
                "交易频率异常";


            }





            return {

                ...user,

                risk,

                reason

            };


        });







    const summary = {


        total:

            riskUsers.length,



        high:

            riskUsers.filter(

                user=>

                user.risk==="高风险钱包"

            ).length,



        suspicious:

            riskUsers.filter(

                user=>

                user.risk==="可疑钱包"

            ).length



    };








    const riskGroups=[


        {

            name:"高风险钱包",

            key:"高风险钱包",

            strategy:
            "限制奖励、人工审核"

        },


        {

            name:"可疑钱包",

            key:"可疑钱包",

            strategy:
            "持续观察行为变化"

        },


        {

            name:"正常钱包",

            key:"正常钱包",

            strategy:
            "正常生态运营"

        }


    ];








    return (

        <div className="page page-segmentation">





            <div className="glass-panel info-card">


                <div className="page-title">

                    Sybil 风险检测

                </div>



                <p>

                    基于钱包交易行为识别异常账户，
                    降低机器人和批量钱包影响。

                </p>


            </div>









            <div className="section-title">

                风险概览

            </div>






            <div className="sybil-kpi-grid">


                <div className="glass-card sybil-kpi">

                    <h3>
                        钱包数量
                    </h3>

                    <p>
                        {summary.total}
                    </p>

                </div>



                <div className="glass-card sybil-kpi">

                    <h3>
                        高风险钱包
                    </h3>

                    <p>
                        {summary.high}
                    </p>

                </div>




                <div className="glass-card sybil-kpi">

                    <h3>
                        可疑钱包
                    </h3>

                    <p>
                        {summary.suspicious}
                    </p>

                </div>




                <div className="glass-card sybil-kpi">

                    <h3>
                        风险比例
                    </h3>

                    <p>

                    {

                    (

                    (
                    summary.high +
                    summary.suspicious
                    )
                    /
                    summary.total *
                    100

                    )

                    .toFixed(1)

                    }%

                    </p>

                </div>



            </div>









            <div className="section-title">

                风险等级分层

            </div>







            <div className="sybil-grid">


            {


            riskGroups.map(group=>{


                const count =

                    riskUsers.filter(

                        user=>

                        user.risk===group.key

                    ).length;



                return (

                    <div

                    className="glass-card sybil-card"

                    key={group.key}

                    >


                        <h3>

                            {group.name}

                        </h3>



                        <div className="sybil-number">

                            {count}

                        </div>



                        <p>

                            策略：

                            {group.strategy}

                        </p>


                    </div>

                );


            })


            }



            </div>









            <div className="section-title">

                异常钱包画像

            </div>





            <div className="glass-card sybil-list">



            {


            riskUsers

            .filter(

                user=>

                user.risk!=="正常钱包"

            )

            .slice(0,10)

            .map(user=>(


                <div

                className="sybil-item"

                key={user.wallet_address}

                >


                    <p>

                    钱包：

                    {
                    user.wallet_address
                    ?

                    user.wallet_address.slice(0,14)
                    +"..."

                    :

                    "-"
                    }

                    </p>



                    <p>

                    交易次数：

                    {user.total_events}

                    </p>



                    <p>

                    风险原因：

                    {user.reason}

                    </p>


                </div>


            ))



            }



            </div>









            <div className="section-title">

                安全建议

            </div>




            <div className="glass-card sybil-strategy">


                <ul>

                    <li>
                        对高风险钱包限制奖励领取
                    </li>


                    <li>
                        对异常行为钱包增加验证机制
                    </li>


                    <li>
                        建立持续钱包行为评分体系
                    </li>


                </ul>


            </div>





        </div>

    );


}


export default SybilDetection;