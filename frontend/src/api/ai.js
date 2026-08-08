import { apiUrl } from "./config";
const AI_API =
apiUrl("/api/ai/strategy");



export async function generateStrategy(
    analysisType,
    profile
){

    const response =

    await fetch(

        AI_API,

        {

            method:"POST",

            headers:{

                "Content-Type":
                "application/json"

            },


            body:JSON.stringify({

                analysis_type:
                analysisType,


                profile

            })

        }

    );



    const data =
        await response.json();



    if(!data.success){

        throw new Error(
            "AI策略生成失败"
        );

    }



    return data.strategy;

}