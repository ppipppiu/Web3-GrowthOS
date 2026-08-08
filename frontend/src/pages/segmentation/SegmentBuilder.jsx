import { apiUrl } from "../../api/config";
import React, {
    useEffect,
    useState
} from "react";


import {
    useNavigate
} from "react-router-dom";


import MetricDistributionCard 
from "./MetricDistributionCard";



export default function SegmentBuilder(){


    const navigate = useNavigate();



    const [
        distribution,
        setDistribution
    ] = useState({});



    const [
        selectedRules,
        setSelectedRules
    ] = useState({});





    useEffect(()=>{


        fetch(
            apiUrl("/api/profile/distribution")
        )

        .then(res=>res.json())

        .then(data=>{


            if(data.success){

                setDistribution(
                    data.distribution
                );

            }


        })

        .catch(err=>{


            console.error(
                "获取数据分布失败:",
                err
            );


        });


    },[]);








    function handleRuleChange(
        metric,
        rule
    ){


        setSelectedRules({

            ...selectedRules,

            [metric]:rule

        });


    }








    async function generateSegment(){



        if(
            Object.keys(selectedRules).length===0
        ){

            alert(
                "请至少选择一个用户分层条件"
            );

            return;

        }





        try{


            const response = await fetch(

                apiUrl("/api/segment/create"),

                {

                    method:"POST",

                    headers:{

                        "Content-Type":
                        "application/json"

                    },


                    body:JSON.stringify({

                        rules:selectedRules

                    })


                }

            );



            const result =
            await response.json();





            console.log(
                "Segment Result:",
                result
            );





            if(result.success){


                navigate(
                    "/segment-result"
                );


            }
            else{


                alert(
                    result.message ||
                    "生成用户分层失败"
                );


            }



        }
        catch(error){


            console.error(
                error
            );


            alert(
                "请求失败，请检查后端"
            );


        }



    }








    return (


        <div className="page">



            <h1>

                用户分层配置

            </h1>





            <p className="page-description">


                根据当前链上用户数据分布，
                自定义用户群体筛选条件，
                生成不同价值用户 Segment。


            </p>








            <div className="glass-card segment-intro">


                <h2>

                    如何定义用户群体？

                </h2>



                <p>

                    GrowthOS 会自动分析当前上传数据中的用户行为分布。
                    你可以根据交易价值、交易次数等指标，
                    选择目标用户范围。

                </p>



                <p>

                    例如：

                    选择交易价值「前25%用户」，
                    系统会自动根据当前数据计算对应阈值。

                </p>



            </div>









            <h2 className="section-title">

                用户行为数据分布

            </h2>






            {

                Object.keys(distribution).length===0

                ?

                (

                    <div className="glass-card">


                        暂无数据，请先上传并分析链上数据


                    </div>

                )

                :

                (

                    <div className="analysis-grid">


                    {

                        Object.keys(distribution)

                        .map(metric=>(


                            <MetricDistributionCard


                                key={metric}


                                metric={metric}


                                data={
                                    distribution[metric]
                                }


                                selectedRule={
                                    selectedRules[metric]
                                }


                                onRuleChange={
                                    handleRuleChange
                                }



                            />


                        ))


                    }


                    </div>


                )


            }









            <div className="segment-action">


                <button


                    className="gradient-button"


                    onClick={
                        generateSegment
                    }


                >


                    生成用户分层


                </button>



            </div>







        </div>


    );


}