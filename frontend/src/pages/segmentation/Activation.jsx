import { useEffect, useState } from "react";


function Activation(){


    const [
        activationData,
        setActivationData
    ] = useState(null);



    useEffect(()=>{


        const result =
            localStorage.getItem(
                "analysis_result"
            );


        if(result){


            const data =
                JSON.parse(result);



            setActivationData(
                data.activation_analysis
            );


        }


    },[]);





    if(!activationData){


        return (

            <div className="page page-segmentation">


                <div className="glass-panel info-card">


                    <h2>
                        暂无用户激活分析数据
                    </h2>


                    <p>
                        请先上传链上交易数据并完成分析。
                    </p>


                </div>


            </div>

        );


    }





    const funnel =
        activationData.funnel || [];



    const segments =
        activationData.segments || [];






    /*
        计算漏斗转化率和流失
    */

    const funnelAnalysis =
        funnel.map(
            (item,index)=>{


                const previous =
                    funnel[index-1];


                const conversion =
                    index === 0

                    ?

                    100

                    :

                    previous.users === 0

                    ?

                    0

                    :

                    (
                        item.users /
                        previous.users *
                        100
                    ).toFixed(1);



                const loss =

                    index === 0

                    ?

                    0

                    :

                    previous.users -
                    item.users;



                return {

                    ...item,

                    conversion,

                    loss

                };


            }

        );





    /*
        最大流失节点
    */


    const maxLoss =

        funnelAnalysis
        .slice(1)
        .reduce(

            (max,item)=>{


                return item.loss > max.loss

                ?

                item

                :

                max;


            },

            {
                name:"",
                loss:0
            }

        );






    const totalUsers =

        segments.reduce(

            (sum,item)=>

                sum + item.count,

            0

        );






    return (


        <div className="page page-segmentation">





            <div className="glass-panel info-card">


                <div className="page-title">

                    用户激活分析

                </div>



                <p>

                    分析钱包用户从链上进入、
                    首次交易到持续活跃的转化过程，
                    找出影响用户激活的关键环节。

                </p>


            </div>









            {/* 用户行为漏斗 */}



            <div className="section-title">

                用户行为漏斗

            </div>




            <div className="activation-funnel">



            {


            funnelAnalysis.map(

                (item,index)=>(


                    <div

                    className="activation-funnel-card glass-card"

                    key={item.name}


                    >


                        <h3>

                            {item.name}

                        </h3>



                        <div className="funnel-number">

                            {
                                item.users
                                .toLocaleString()
                            }

                        </div>




                        {

                        index > 0 &&

                        <>

                        <p>

                            转化率：

                            {item.conversion}%

                        </p>



                        <p className="loss-text">

                            流失：

                            {item.loss}

                            用户

                        </p>

                        </>

                        }



                    </div>


                )


            )


            }



            </div>









            {/* 关键问题 */}



            <div className="section-title">

                激活问题定位

            </div>




            <div className="glass-card activation-insight">


                <h3>

                    最大用户流失节点

                </h3>



                <p>

                    {

                    maxLoss.name

                    }

                    阶段流失

                    <strong>

                    {

                    maxLoss.loss

                    }

                    </strong>

                    个用户

                </p>



                <p>

                    说明：

                    大量用户在该阶段未完成下一步链上行为，
                    需要针对该阶段优化用户激励和交互流程。

                </p>



            </div>









            {/* 用户激活分层 */}



            <div className="section-title">

                用户激活分层

            </div>





            <div className="activation-segments">



            {


            segments.map(

                (item)=>(


                    <div

                    className="activation-card glass-card"

                    key={item.name}

                    >



                        <h3>

                            {item.name}

                        </h3>



                        <div className="activation-number">

                            {

                            item.count
                            .toLocaleString()

                            }

                        </div>



                        <p>

                            占比：

                            {

                            totalUsers === 0

                            ?

                            0

                            :

                            (

                            item.count /
                            totalUsers *
                            100

                            ).toFixed(1)

                            }

                            %

                        </p>




                        <p>

                            用户特征：

                            {item.description}

                        </p>




                        <p>

                            运营建议：

                            {item.strategy}

                        </p>



                    </div>


                )


            )


            }



            </div>






            {/* 增长建议 */}



            <div className="section-title">

                增长策略建议

            </div>




            <div className="glass-card activation-strategy">


                <h3>

                    推荐优化方向

                </h3>


                <ul>

                    <li>
                        提供首次交易激励，
                        降低新用户进入门槛
                    </li>


                    <li>
                        针对首次交易用户设计二次交易任务
                    </li>


                    <li>
                        对高活跃用户提供长期权益体系
                    </li>


                </ul>



            </div>





        </div>


    );


}


export default Activation;