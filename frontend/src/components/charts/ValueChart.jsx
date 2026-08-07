import {
    Doughnut
} from "react-chartjs-2";


import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";


import {
    useEffect,
    useState
} from "react";


ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);





function ValueChart({data}){


    const [
        valueModel,
        setValueModel
    ] = useState(null);




    useEffect(()=>{


        const model =

        localStorage.getItem(
            "value_model"
        );


        if(model){

            setValueModel(
                JSON.parse(model)
            );

        }


    },[]);





    const chartData={


        labels:[

            "高价值用户",

            "中价值用户",

            "低价值用户"

        ],



        datasets:[{


            data:

            data?.length

            ?

            data

            :

            [

                0,

                0,

                0

            ],



            borderWidth:0


        }]

    };





    return (

    <div className="chart-card glass-card">



        <h3>

            用户价值分布

        </h3>





        <Doughnut

            data={chartData}

        />





        {


        valueModel &&


        <div className="value-model-summary">


            <h4>

                当前价值模型

            </h4>



            <p>

                交易价值：

                {

                valueModel.weights.volume

                }%

            </p>



            <p>

                用户活跃度：

                {

                valueModel.weights.activity

                }%

            </p>



            <p>

                用户留存：

                {

                valueModel.weights.retention

                }%

            </p>



            <p>

                交易次数：

                {

                valueModel.weights.transaction

                }%

            </p>



        </div>


        }



    </div>


    );


}


export default ValueChart;