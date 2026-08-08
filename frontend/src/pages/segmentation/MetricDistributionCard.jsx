import React from "react";



export default function MetricDistributionCard({

    metric,

    data,

    selectedRule,

    onRuleChange


}){





    const metricName = {


        transaction_value:
        "交易价值",


        transaction_count:
        "交易次数",


        active_days:
        "活跃天数",


        wallet_age:
        "钱包年龄",


        contract_interactions:
        "合约交互次数"


    };






    const options=[


        {

            value:"top10",

            label:"前10%用户"

        },


        {

            value:"top25",

            label:"前25%用户"

        },


        {

            value:"top50",

            label:"前50%用户"

        }


    ];






    return (



        <div className="glass-card metric-card">





            <h2>


                {
                    metricName[metric]
                    ||
                    metric
                }


            </h2>






            <p className="metric-description">


                根据当前数据自动计算用户分布范围


            </p>







            <div className="distribution-grid">



                <div>


                    <span>
                        最低值
                    </span>


                    <strong>
                        {data.min}
                    </strong>


                </div>





                <div>


                    <span>
                        25%用户
                    </span>


                    <strong>
                        {data.p25}
                    </strong>


                </div>






                <div>


                    <span>
                        中位用户
                    </span>


                    <strong>
                        {data.p50}
                    </strong>


                </div>






                <div>


                    <span>
                        75%用户
                    </span>


                    <strong>
                        {data.p75}
                    </strong>


                </div>






                <div>


                    <span>
                        90%用户
                    </span>


                    <strong>
                        {data.p90}
                    </strong>


                </div>






                <div>


                    <span>
                        最高值
                    </span>


                    <strong>
                        {data.max}
                    </strong>


                </div>





            </div>









            <div className="rule-selector">



                <h3>

                    选择用户范围

                </h3>






                {

                    options.map(option=>(



                        <label


                            key={option.value}


                            className="rule-option"


                        >



                            <input


                                type="radio"


                                name={metric}


                                checked={
                                    selectedRule
                                    ===
                                    option.value
                                }


                                onChange={()=>{


                                    onRuleChange(

                                        metric,

                                        option.value

                                    )


                                }}



                            />



                            <span>

                                {option.label}

                            </span>




                        </label>




                    ))



                }





            </div>






        </div>


    );


}