import {
    useState
} from "react";


import {
    useNavigate
} from "react-router-dom";





function ValueDefinition(){


    const navigate = useNavigate();



    /*
        当前用户价值目标

        内部使用英文 value
        UI显示中文
    */


    const [objective,setObjective] =

        useState(
            "Revenue Growth"
        );




    /*
        原始权重

        系统会自动归一化
        输出百分比总和 = 100%
    */


    const [weights,setWeights] =

        useState({

            volume:50,

            activity:30,

            retention:10,

            transaction:10

        });







    /*
        增长目标配置
    */


    const objectives=[


        {

            value:"Revenue Growth",

            label:"收入增长"


        },


        {

            value:"User Retention",

            label:"用户留存"


        },


        {

            value:"Ecosystem Activity",

            label:"生态活跃"


        },


        {

            value:"Custom",

            label:"自定义"


        }


    ];








    /*
        价值指标配置
    */


    const metrics=[


        {

            key:"volume",

            label:"交易价值",

            description:
            "用户产生的交易金额和资产贡献"

        },


        {

            key:"activity",

            label:"用户活跃度",

            description:
            "用户链上行为频率和参与程度"

        },


        {

            key:"retention",

            label:"用户留存",

            description:
            "用户持续参与生态的能力"

        },


        {

            key:"transaction",

            label:"交易次数",

            description:
            "用户交易行为数量"

        }


    ];







    /*
        权重归一化

        保证总比例100%
    */


    const normalizedWeights = ()=>{


        const total =

            Object.values(weights)

            .reduce(

                (a,b)=>a+b,

                0

            );



        return {


            volume:

            Number(

                (

                weights.volume /

                total *

                100

                )

                .toFixed(1)

            ),



            activity:

            Number(

                (

                weights.activity /

                total *

                100

                )

                .toFixed(1)

            ),



            retention:

            Number(

                (

                weights.retention /

                total *

                100

                )

                .toFixed(1)

            ),



            transaction:

            Number(

                (

                weights.transaction /

                total *

                100

                )

                .toFixed(1)

            )


        };


    };







    const displayWeights =

        normalizedWeights();









    /*
        调整权重

    */


    const updateWeight=(key,value)=>{


        setWeights({

            ...weights,

            [key]:

            Number(value)


        });


    };









    /*
        保存价值模型

    */


    const saveModel=()=>{


        const model={


            objective,


            weights:

                displayWeights,


            updatedAt:

                new Date()

                .toISOString()


        };




        localStorage.setItem(

            "value_model",

            JSON.stringify(model)

        );



        navigate("/dashboard");


    };









    return (


    <div className="page-container">



        <div className="page-title">


            定义用户价值模型


        </div>



        <div className="page-description">


            根据项目增长目标，自定义用户价值评估标准


        </div>









        {/* Growth Objective */}



        <div className="glass-card value-section">


            <h2>

                增长目标

            </h2>



            <p>

                不同增长目标会影响用户价值判断标准

            </p>



            <div className="objective-grid">



            {


            objectives.map(

                item=>(


                <button


                key={item.value}


                className={


                    objective===item.value


                    ?

                    "objective-card active"


                    :

                    "objective-card"


                }



                onClick={

                    ()=>setObjective(

                        item.value

                    )

                }


                >



                    {item.label}



                </button>


                )


            )


            }



            </div>


        </div>









        {/* Value Metrics */}



        <div className="glass-card value-section">


            <h2>

                价值指标权重

            </h2>



            <p>

                调整不同指标在用户价值评分中的重要程度

            </p>






            {


            metrics.map(

                metric=>(



                <div

                className="weight-row"

                key={metric.key}

                >



                    <div>


                        <span>


                            {metric.label}


                        </span>



                        <strong>


                            {

                            displayWeights[metric.key]

                            }%



                        </strong>


                    </div>




                    <small>


                        {metric.description}


                    </small>





                    <input


                    type="range"


                    min="0"


                    max="100"



                    value={

                        weights[metric.key]

                    }



                    onChange={

                        e=>

                        updateWeight(

                            metric.key,

                            e.target.value

                        )

                    }


                    />


                </div>


                )


            )


            }





        </div>









        {/* Formula */}




        <div className="glass-card value-section">


            <h2>

                当前价值评分模型

            </h2>




            <p>

                用户价值评分 =

            </p>




            <p>

                交易价值 × {displayWeights.volume}%

            </p>



            <p>

                + 用户活跃度 × {displayWeights.activity}%

            </p>



            <p>

                + 用户留存 × {displayWeights.retention}%

            </p>



            <p>

                + 交易次数 × {displayWeights.transaction}%

            </p>




            <div>


                当前权重总和：

                <strong>

                    {

                    Object.values(displayWeights)

                    .reduce(

                        (a,b)=>a+b,

                        0

                    )

                    }%

                </strong>


            </div>




        </div>









        <button


        className="primary-button save-model-button"



        onClick={saveModel}


        >



            保存价值模型



        </button>







    </div>


    );


}



export default ValueDefinition;