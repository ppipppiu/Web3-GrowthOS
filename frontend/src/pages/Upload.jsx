import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { analyzeCSV } from "../api/analyze";


function Upload() {

    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();



    const handleAnalyze = async () => {


        if (!file) {

            alert(
                "请先上传 CSV 数据文件"
            );

            return;

        }



        try {


            setLoading(true);



            const result = await analyzeCSV(file);



            console.log(
                "分析结果:",
                result
            );



            // 保存分析结果，供 Dashboard 使用

            localStorage.setItem(
                "analysis_result",
                JSON.stringify(result)
            );



            // 跳转到 Dashboard

            navigate(
                "/dashboard"
            );



        } catch (error) {


            console.error(
                error
            );


            alert(
                "数据分析失败，请检查后端服务是否正常运行"
            );



        } finally {


            setLoading(false);


        }


    };



    return (

        <div className="upload-page">


            <h1>
                上传链上数据
            </h1>



            <p>
                上传钱包交易数据 CSV 文件，
                系统将自动完成用户行为分析和增长洞察。
            </p>



            <input

                type="file"

                accept=".csv"

                onChange={
                    (e) =>
                    setFile(
                        e.target.files[0]
                    )
                }

            />



            {
                file && (

                    <p>

                        当前文件：

                        {file.name}

                    </p>

                )
            }



            <button

                onClick={handleAnalyze}

                disabled={loading}

            >

                {

                    loading

                    ?

                    "正在分析..."

                    :

                    "开始分析"

                }


            </button>



        </div>


    );

}


export default Upload;