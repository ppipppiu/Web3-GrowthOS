import { apiUrl } from "../api/config";
import React, {
    useEffect,
    useState
} from "react";


import {
    useParams,
    useSearchParams
} from "react-router-dom";

import {
    getWallet
} from "../blockchain/wallet";

import {
    generateStrategy
} from "../api/ai";





export default function GrowthAnalysisResult(){


    const {
        type
    } = useParams();




    const [
        profile,
        setProfile
    ] = useState(null);




    const [
        aiStrategy,
        setAiStrategy
    ] = useState("");




    const [
        loading,
        setLoading
    ] = useState(false);






    const titleMap = {


        growth:

        "用户增长分析",



        retention:

        "用户留存分析",



        sybil:

        "Sybil 风险分析",


        value:

        "用户价值分析"


    };


    const [
        searchParams
    ] = useSearchParams();


    const reportId =
        searchParams.get(
            "reportId"
        );




    useEffect(()=>{

        loadProfile();

    },[
        type,
        reportId
    ]);



    async function loadProfile(){


        try{


            const wallet =
                getWallet();


            let url =
                apiUrl(`/api/analysis/profile/${type}`);


            if (
                reportId
                &&
                wallet
            ) {

                url +=

                    `?wallet_address=${encodeURIComponent(
                        wallet
                    )}`

                    +

                    `&report_id=${encodeURIComponent(
                        reportId
                    )}`;

            }


            const response =

            await fetch(

                url

            );



            const data =

            await response.json();





            console.log(

                "Analysis Profile:",

                data

            );





            if(data.success){


                setProfile(

                    data.profile

                );


            }



        }


        catch(error){


            console.error(

                error

            );


        }



    }









    async function handleGenerateStrategy(){


        if(!profile){

            return;

        }



        setLoading(true);



        try{


            const strategy =


            await generateStrategy(

                type,

                profile

            );





            setAiStrategy(

                strategy

            );



        }


        catch(error){


            console.error(

                "AI策略生成失败:",

                error

            );


            setAiStrategy(

                "AI策略生成失败，请稍后重试。"

            );


        }


        finally{


            setLoading(false);


        }


    }









    if(!profile){


        return (

            <div className="page">


                <div className="glass-card">


                    正在加载分析数据...


                </div>


            </div>

        );


    }








    return (


        <div className="page">





            <h1>

                {
                    titleMap[type]
                }


            </h1>






            <p className="page-description">


                GrowthOS 根据链上行为数据，
                自动生成分析画像，并提供 AI 优化建议。


            </p>









            {/* 数据画像 */}


            <div className="glass-card">



                <h2>


                    数据画像


                </h2>





                <div className="analysis-grid">


                {


                    Object.entries(profile)

                    .map(([key,value])=>(



                        <div


                        className="glass-card"


                        key={key}


                        >



                            <p>


                                {key}


                            </p>




                            <h3>


                            {


                                typeof value==="object"


                                ?


                                JSON.stringify(

                                    value

                                )


                                :


                                value



                            }


                            </h3>




                        </div>


                    ))


                }


                </div>



            </div>









            {/* AI策略 */}



            <div className="glass-card">



                <h2>


                    AI 策略建议


                </h2>






                {


                aiStrategy


                ?


                (

                    <pre

                    className="ai-result"

                    >


                        {

                            aiStrategy

                        }


                    </pre>


                )



                :



                (

                    <button


                    className="gradient-button"


                    onClick={

                        handleGenerateStrategy

                    }


                    >


                    {


                    loading


                    ?


                    "AI分析中..."


                    :


                    "生成AI策略"



                    }



                    </button>


                )


                }




            </div>







        </div>


    );


}