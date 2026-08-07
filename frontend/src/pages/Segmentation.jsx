import { useNavigate } from "react-router-dom";


function Segmentation(){

    const navigate = useNavigate();



    const growthProblems = [

        {
            title:"🚀 用户激活分析",
            subtitle:"User Activation",
            description:
                "分析新用户为什么没有完成首次链上行为，提升首次交易转化率",
            path:"/segmentation/activation"
        },


        {
            title:"💰 用户价值分析",
            subtitle:"User Value",
            description:
                "识别高价值钱包用户，提高用户长期贡献和生态价值",
            path:"/segmentation/value"
        },


        {
            title:"🔄 用户留存分析",
            subtitle:"User Retention",
            description:
                "发现沉默用户和流失风险钱包，提升长期活跃",
            path:"/segmentation/retention"
        },


        {
            title:"🛡 Sybil 风险检测",
            subtitle:"Sybil Detection",
            description:
                "识别异常钱包行为，降低机器人和批量操作风险",
            path:"/segmentation/sybil"
        }

    ];




    return (

        <div className="page page-segmentation">


            <div className="glass-panel info-card">


                <div className="page-title">

                    用户分层分析

                </div>



                <p>

                    根据不同增长目标选择分析模型，
                    对链上用户进行分层并生成运营洞察。

                </p>



            </div>





            <div className="section-title">

                选择需要解决的增长问题

            </div>





            <div className="segment-container">


                {

                    growthProblems.map((item)=>(


                        <div

                            className="segment-card glass-card"

                            key={item.title}

                            onClick={()=>navigate(item.path)}

                            style={{
                                cursor:"pointer"
                            }}

                        >


                            <h3>

                                {item.title}

                            </h3>



                            <span>

                                {item.subtitle}

                            </span>



                            <p
                            style={{
                                fontSize:"16px",
                                fontWeight:"400",
                                marginTop:"18px"
                            }}
                            >

                                {item.description}

                            </p>



                            <button

                                className="segment-button"

                                onClick={()=>
                                    navigate(item.path)
                                }

                            >

                                查看分析 →

                            </button>



                        </div>


                    ))

                }



            </div>


        </div>

    );

}


export default Segmentation;