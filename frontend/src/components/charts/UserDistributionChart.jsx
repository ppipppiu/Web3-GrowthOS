import {

    Bar

} from "react-chartjs-2";



import {


    Chart as ChartJS,


    BarElement,


    CategoryScale,


    LinearScale,


    Tooltip,


    Legend


} from "chart.js";



ChartJS.register(

    BarElement,

    CategoryScale,

    LinearScale,

    Tooltip,

    Legend

);








function UserDistributionChart({

    data=[]

}){


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

                    item=>item.value

                ),




                backgroundColor:


                [

                    "#8b5cf6",

                    "#38bdf8",

                    "#64748b"

                ],




                borderRadius:10



            }


        ]

    };






    const options={


        responsive:true,


        maintainAspectRatio:false,



        plugins:{



            legend:{


                labels:{


                    color:"#cbd5e1"


                }


            }

        },



        scales:{



            x:{


                ticks:{


                    color:"#94a3b8"


                },



                grid:{


                    display:false


                }


            },



            y:{


                ticks:{


                    color:"#94a3b8"


                },



                grid:{


                    color:"rgba(255,255,255,0.05)"


                }


            }


        }


    };







    return (


        <div className="chart-card glass-card">


            <h3 className="chart-title">

                用户结构分布

            </h3>





            <div className="chart-wrapper">


            {


            data.length>0

            ?

            <Bar

            data={chartData}

            options={options}

            />

            :

            <p>

                暂无用户结构数据

            </p>


            }



            </div>


        </div>


    );


}



export default UserDistributionChart;