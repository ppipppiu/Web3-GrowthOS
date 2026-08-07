import {
    useState
} from "react";


import {
    useNavigate
} from "react-router-dom";





function ValueDefinition(){


    const navigate = useNavigate();



    const [objective,setObjective] =

        useState(
            "Revenue Growth"
        );



    const [error,setError] =

        useState("");




    const [weights,setWeights] =

        useState({

            volume:50,

            activity:30,

            retention:10,

            transaction:10

        });





    const objectives=[


        {

            value:"Revenue Growth",

            label:"收入增长",

            preset:{

                volume:50,

                activity:30,

                retention:0,

                transaction:20

            }

        },


        {

            value:"User Retention",

            label:"用户留存",

            preset:{

                volume:20,

                activity:30,

                retention:40,

                transaction:10

            }

        },


        {

            value:"Ecosystem Activity",

            label:"生态活跃",

            preset:{

                volume:20,

                activity:50,

                retention:20,

                transaction:10

            }

        },


        {

            value:"Custom",

            label:"自定义"

        }


    ];







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







    const updateWeight=(key,value)=>{


        setWeights({

            ...weights,

            [key]:

            Number(value)

        });


        setError("");

    };







    const totalWeight =

        Object.values(weights)

        .reduce(

            (a,b)=>a+b,

            0

        );






    const applyPreset=(item)=>{


        setObjective(

            item.value

        );


        if(item.preset){


            setWeights(

                item.preset

            );


        }


        setError("");

    };







    const saveModel=async()=>{


        setError("");



        const model={


            objective,


            weights,


            updatedAt:

            new Date()

            .toISOString()


        };




        try{



            const response = await fetch(

                "http://localhost:8000/api/value-model/check",

                {


                    method:"POST",


                    headers:{


                        "Content-Type":

                        "application/json"


                    },


                    body:JSON.stringify({


                        value_model:model


                    })


                }


            );





            const result = await response.json();





            if(!result.valid){


                setError(

                    result.message

                );


                return;

            }







            localStorage.setItem(

                "value_model",

                JSON.stringify(model)

            );



            navigate(

                "/dashboard"

            );





        }


        catch(error){



            setError(

                "价值模型校验失败，请检查后端服务"

            );


        }


    };









    return (


    <div className="page-container">



        <div className="page-title">

            定义用户价值模型

        </div>



        <div className="page-description">

            根据项目增长目标，自定义用户价值评估标准

        </div>








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

                    ()=>applyPreset(item)

                }


                >


                    {item.label}


                </button>


                )


            )

            }



            </div>



        </div>









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

                            {weights[metric.key]}%

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









        <div className="glass-card value-section">


            <h2>

                当前价值评分模型

            </h2>




            <p>

                用户价值评分 =

            </p>




            <p>

                交易价值 × {weights.volume}%

            </p>



            <p>

                + 用户活跃度 × {weights.activity}%

            </p>



            <p>

                + 用户留存 × {weights.retention}%

            </p>



            <p>

                + 交易次数 × {weights.transaction}%

            </p>





            <div>


                当前权重总和：

                <strong>

                    {totalWeight}%

                </strong>


            </div>



        </div>







        {

        error &&


        <div className="glass-card error-card">


            {error}


        </div>


        }







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