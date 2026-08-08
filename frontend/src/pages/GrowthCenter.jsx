import {
    useParams,
    useNavigate
} from "react-router-dom";


import SegmentBuilder 
from "./segmentation/SegmentBuilder";





function GrowthCenter(){


    const {
        type
    } = useParams();



    const navigate = useNavigate();





    /*
        用户价值：

        使用自定义 Segment 流程

    */


    if(type==="value"){


        return (

            <SegmentBuilder/>

        );


    }







    /*
        其他分析：

        使用统一分析结果页面

    */


    return (

        <div className="page">


            <div className="glass-card">


                <h1>

                    {

                    type==="growth"

                    ?

                    "用户增长分析"

                    :

                    type==="retention"

                    ?

                    "用户留存分析"

                    :

                    "Sybil风险分析"

                    }


                </h1>




                <p>


                    正在进入 AI 分析中心...


                </p>





                <button


                className="gradient-button"


                onClick={()=>{


                    navigate(

                        `/growth-analysis/${type}`

                    );


                }}


                >


                    开始分析



                </button>




            </div>


        </div>

    );


}



export default GrowthCenter;