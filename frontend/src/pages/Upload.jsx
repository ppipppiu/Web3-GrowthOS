import {useState} from "react";

import {useNavigate} from "react-router-dom";


function Upload(){


    const navigate = useNavigate();


    const [file,setFile]=useState(null);


    const [loading,setLoading]=useState(false);





    function handleFile(e){


        setFile(e.target.files[0]);


    }





    async function analyze(){


        if(!file){

            alert("请先上传数据文件");

            return;

        }



        setLoading(true);



        const formData=new FormData();


        formData.append(

            "file",

            file

        );




        try{


            const res=await fetch(

                "http://localhost:8000/api/analyze",

                {

                    method:"POST",

                    body:formData

                }

            );



            if(!res.ok){

                throw new Error();

            }



            const data=await res.json();



            localStorage.setItem(

                "analysisData",

                JSON.stringify(data)

            );



            navigate("/dashboard");



        }

        catch(e){


            alert(

                "数据分析失败，请检查后端服务"

            );


        }



        finally{


            setLoading(false);


        }


    }





    return (



        <div className="page upload-page">


            <h1>

                上传链上数据

            </h1>



            <p className="page-desc">

                上传钱包交易数据 CSV 文件，系统将自动完成用户行为分析和增长洞察。

            </p>




            <div className="upload-card glass-card">



                <label className="upload-box">


                    <input

                    type="file"

                    accept=".csv,.xlsx"

                    onChange={handleFile}

                    />


                    <div>


                    📂

                    <br/>


                    点击上传数据文件


                    </div>



                </label>





                {

                file &&


                <div className="file-info">


                    当前文件：

                    <span>

                    {file.name}

                    </span>



                </div>


                }





                <button


                className="primary-btn"


                onClick={analyze}


                disabled={loading}


                >


                {

                loading

                ?

                "分析中..."

                :

                "开始分析"

                }



                </button>



            </div>



        </div>


    );


}



export default Upload;