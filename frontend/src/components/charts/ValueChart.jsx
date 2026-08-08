import {
    Pie
} from "react-chartjs-2";


import {

    Chart as ChartJS,

    ArcElement,

    Tooltip,

    Legend

} from "chart.js";


ChartJS.register(

    ArcElement,

    Tooltip,

    Legend

);





function ValueChart({

    data = []

}){


    const chartData = {


        labels:

        data.map(

            item => item.name

        ),



        datasets:[


            {

                label:"用户数量",


                data:

                data.map(

                    item => item.value

                ),



                backgroundColor:[
                    "#8b5cf6", // 低价值用户
                    "#38bdf8", // 潜力用户
                    "#22c55e", // 高价值用户
                    "#64748b"  // 普通用户
                ],

                borderColor:[
                    "#a78bfa",
                    "#7dd3fc",
                    "#4ade80",
                    "#94a3b8"
                ],



                borderWidth:2


            }


        ]


    };





    const options = {


        responsive:true,


        maintainAspectRatio:false,



        plugins:{


            legend:{


                position:"bottom",



                labels:{


                    color:"#cbd5e1",



                    font:{


                        size:14


                    }


                }


            },



            tooltip:{


                enabled:true


            }


        }


    };





    return (

        <div className="chart-card glass-card">


            <h3 className="chart-title">

                用户价值分布

            </h3>




            <div className="chart-wrapper">


            {

            data.length > 0

            ?

            <Pie

            data={chartData}

            options={options}

            />

            :

            <p>

                暂无价值数据

            </p>

            }



            </div>


        </div>


    );


}


export default ValueChart;