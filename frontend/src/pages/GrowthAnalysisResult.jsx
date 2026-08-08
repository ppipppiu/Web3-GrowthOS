import React, {
    useEffect,
    useState
} from "react";


import {
    useParams
} from "react-router-dom";



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
        "Sybil 风险分析"


    };







    useEffect(()=>{


        loadProfile();


    },[type]);







    async function loadProfile(){


        try{


            const response =
            await fetch(

                `http://localhost:8000/api/analysis/profile/${type}`

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








    async function generateStrategy(){


        if(!profile){

            return;

        }



        setLoading(true);



        try{


            const response =
            await fetch(

                "http://localhost:8000/api/ai/strategy",

                {


                    method:"POST",


                    headers:{


                        "Content-Type":
                        "application/json"


                    },


                    body:JSON.stringify({

                        analysis_type:type,

                        profile:profile

                    })


                }

            );



            const data =
            await response.json();




            console.log(
                "AI Strategy:",
                data
            );




            if(data.success){


                setAiStrategy(
                    data.strategy
                );


            }



        }

        catch(error){


            console.error(
                error
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

                    <pre className="ai-result">


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
                        generateStrategy
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