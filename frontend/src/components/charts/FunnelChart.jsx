function FunnelChart({

    data=[]

}){



    if(!data || data.length===0){


        return (

            <div className="chart-card glass-card">


                <h3 className="chart-title">

                    用户增长漏斗

                </h3>



                <p>

                    暂无漏斗数据

                </p>


            </div>

        );


    }







    const normalizedData = data.map(

        item=>(


            {


                stage:

                item.stage

                ||

                item.name

                ||

                "未知阶段",



                count:

                item.count

                ??

                item.users

                ??

                0,



                conversion_rate:

                item.conversion_rate

                ??

                0


            }


        )

    );







    const maxValue = Math.max(

        ...

        normalizedData.map(

            item=>item.count

        )

    );








    return (

        <div className="chart-card glass-card">



            <div className="funnel-container">



            {


            normalizedData.map(

                (item,index)=>(



                <div

                className="funnel-step"

                key={item.stage}



                style={{


                    width:


                    `${

                    42

                    +

                    (

                        item.count

                        /

                        maxValue

                    )

                    *

                    58

                    }%`



                }}



                >





                    <span>

                        {item.stage}

                    </span>





                    <strong>

                        {item.count}

                    </strong>






                    {


                    item.conversion_rate !== undefined &&


                    <small>


                        转化率：

                        {

                        item.conversion_rate

                        }%


                    </small>



                    }



                </div>


                )


            )


            }



            </div>





        </div>


    );


}



export default FunnelChart;