import {
    Bar
} from "react-chartjs-2";


import {

    Chart as ChartJS,

    CategoryScale,

    LinearScale,

    BarElement,

    Tooltip,

    Legend

} from "chart.js";



ChartJS.register(

    CategoryScale,

    LinearScale,

    BarElement,

    Tooltip,

    Legend

);





function FunnelChart({data=[]}){


    const chartData={


        labels:

        data.map(
            item=>item.name
        ),



        datasets:[

            {

                label:"用户数量",


                data:

                data.map(
                    item=>item.users
                ),



                backgroundColor:[

                    "#8b5cf6",

                    "#3b82f6",

                    "#22c55e",

                    "#f59e0b"

                ],



                borderRadius:12


            }

        ]

    };





    const options={


        responsive:true,


        plugins:{


            legend:{


                display:false


            }


        },


        scales:{


            y:{


                beginAtZero:true


            }


        }



    };





    return (

        <div className="chart-card">


            <h3 className="chart-title">

                用户行为漏斗

            </h3>


            <Bar

                data={chartData}

                options={options}

            />


        </div>

    );

}



export default FunnelChart;