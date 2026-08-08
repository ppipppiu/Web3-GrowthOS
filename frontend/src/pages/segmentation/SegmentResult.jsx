import { apiUrl } from "../../api/config";
import React,{
    useEffect,
    useState
} from "react";



export default function SegmentResult(){


    const [
        data,
        setData
    ] = useState(null);



    const [
        aiResult,
        setAiResult
    ] = useState("");



    const [
        loading,
        setLoading
    ] = useState(false);





    useEffect(()=>{


        fetch(
            apiUrl("/api/segment/result")
        )


        .then(res=>res.json())


        .then(result=>{


            if(result.success){

                setData(result);

            }


        })


    },[]);







    async function generateAI(){



        setLoading(true);



        const response =
        await fetch(

            apiUrl("/api/ai/strategy"),

            {


                method:"POST",


                headers:{


                    "Content-Type":
                    "application/json"


                },


                body:JSON.stringify({

                    profile:data.profile

                })

            }

        );



        const result =
        await response.json();



        if(result.success){

            setAiResult(
                result.strategy
            );

        }


        setLoading(false);



    }







    if(!data){


        return (

            <div className="page">

                <div className="glass-card">

                    暂无用户分层结果

                </div>

            </div>

        )

    }







    const profile=data.profile;





    return (

        <div className="page">


            <h1>

                用户分层结果

            </h1>




            <p className="page-description">

                GrowthOS 根据用户自定义条件，
                自动生成目标用户群体画像。

            </p>





            <div className="glass-card">


                <h2>

                    高价值用户 Segment

                </h2>



                <p>

                    当前Segment包含：

                    <strong>

                    {profile["用户数量"]}

                    </strong>

                    个钱包


                </p>


            </div>







            <div className="analysis-grid">


                <div className="glass-card">


                    <h2>

                        用户规模

                    </h2>


                    <div className="metric-number">

                        {profile["用户数量"]}

                    </div>


                </div>






                <div className="glass-card">


                    <h2>

                        用户价值画像

                    </h2>



                    {

                    Object.keys(profile)

                    .map(key=>(

                        <p key={key}>


                            {key}：

                            <strong>

                            {profile[key]}

                            </strong>


                        </p>


                    ))

                    }


                </div>



            </div>







            <div className="glass-card">


                <h2>

                    AI增长策略建议

                </h2>



                {

                aiResult

                ?

                <pre>

                {aiResult}

                </pre>


                :

                <button

                className="gradient-button"

                onClick={generateAI}

                >

                {

                loading

                ?

                "AI分析中..."

                :

                "生成AI增长策略"

                }


                </button>


                }



            </div>






        </div>


    );



}