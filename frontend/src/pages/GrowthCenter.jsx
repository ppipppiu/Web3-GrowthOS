import { useParams } from "react-router-dom";


const analysisData = {


    value:{


        title:"用户价值分析",


        description:
        "分析用户价值分布、高价值用户画像以及价值贡献来源。",



        profile:[

            "高价值用户主要由高交易金额和高交易频率贡献",

            "成长用户具有进一步提升活跃度的潜力",

            "普通用户需要提升首次交互和持续参与"

        ],



        strategy:[

            "针对高价值用户建立长期激励体系",

            "针对成长用户设计成长任务",

            "提升普通用户转化效率"

        ]


    },





    growth:{


        title:"用户增长分析",


        description:
        "分析用户增长趋势、增长节点以及增长机会。",



        profile:[


            "用户增长主要来源于新增钱包和重复交易用户",

            "部分时间窗口存在明显活跃峰值"


        ],



        strategy:[


            "针对增长峰值设计运营活动",

            "提高新用户转化效率"


        ]

    },





    retention:{


        title:"用户留存分析",


        description:
        "分析用户持续参与行为和长期活跃情况。",



        profile:[


            "长期活跃用户贡献主要交易价值",

            "重复交易行为是用户留存的重要指标"


        ],



        strategy:[


            "建立用户生命周期运营",

            "提升用户持续参与频率"


        ]


    },






    sybil:{


        title:"Sybil风险分析",


        description:
        "识别异常钱包行为，降低女巫攻击风险。",



        profile:[


            "部分钱包可能存在相似行为模式",

            "需要结合交易时间和交互关系判断"


        ],



        strategy:[


            "建立钱包信誉评分",

            "过滤异常地址"


        ]


    }



};







function GrowthCenter(){



    const {type}=useParams();



    const data =

    analysisData[type]

    ||

    analysisData.value;





    return (

        <div className="page">


            <h1>

                {data.title}

            </h1>





            <div className="glass-card ai-panel">


                <h2>

                AI 用户画像分析

                </h2>


                <p>

                {data.description}

                </p>


            </div>






            <div className="analysis-grid">


                <div className="glass-card">


                    <h2>

                    用户画像

                    </h2>


                    {

                    data.profile.map(

                        (item,index)=>(


                            <p key={index}>

                            • {item}

                            </p>


                        )

                    )


                    }


                </div>






                <div className="glass-card">


                    <h2>

                    AI 增长策略建议

                    </h2>



                    {

                    data.strategy.map(

                        (item,index)=>(


                            <p key={index}>

                            • {item}

                            </p>


                        )

                    )


                    }



                </div>



            </div>



        </div>


    );


}



export default GrowthCenter;