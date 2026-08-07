import { useRef, useState } from "react";
import * as XLSX from "xlsx";

import { analyzeData } from "../api/analyze";

import { getWallet } from "../blockchain/wallet";

import { useNavigate } from "react-router-dom";

function Upload() {


  const fileInputRef = useRef(null);


  const navigate = useNavigate();



  const [uploadStatus, setUploadStatus] =
    useState("idle");



  const [progress, setProgress] =
    useState(0);



  const [analysisResult, setAnalysisResult] =
    useState(null);



  // 保存上传成功后的原始文件

  const [selectedFile, setSelectedFile] =
    useState(null);





  // ==========================
  // 点击本地上传
  // ==========================

  function handleUploadClick() {

    fileInputRef.current.click();

  }





  // ==========================
  // 文件读取
  // ==========================

  function handleFileChange(event) {


    const file =
      event.target.files[0];



    if (!file) {

      return;

    }



    // 保存原始文件

    setSelectedFile(file);



    setUploadStatus("reading");


    setProgress(0);



    const reader =
      new FileReader();





    reader.onprogress = (e)=>{


      if(e.lengthComputable){


        const value =
          Math.round(
            (e.loaded / e.total) * 100
          );


        setProgress(value);


      }


    };







    reader.onload = ()=>{


      try{


        let rows=[];



        // ======================
        // CSV
        // ======================


        if(file.name.endsWith(".csv")){


          const text =
            reader.result;



          const lines =
            text
            .split("\n")
            .filter(
              item =>
              item.trim() !== ""
            );



          const headers =
            lines[0].split(",");




          rows =
            lines
            .slice(1)
            .map(line=>{


              const values =
                line.split(",");



              let obj={};



              headers.forEach(
                (key,index)=>{


                  obj[key.trim()] =
                    values[index];


                }
              );



              return obj;


            });



        }




        // ======================
        // XLSX
        // ======================


        else if(file.name.endsWith(".xlsx")){


          const workbook =
            XLSX.read(
              reader.result,
              {
                type:"array"
              }
            );



          const sheet =
            workbook.Sheets[
              workbook.SheetNames[0]
            ];



          rows =
            XLSX.utils.sheet_to_json(
              sheet
            );


        }







        // ======================
        // 数据校验
        // ======================


        if(rows.length===0){

          throw new Error(
            "empty data"
          );

        }





        const columns =
          Object.keys(rows[0])
          .map(
            item =>
            item.toLowerCase()
          );





        const hasWallet =
          columns.some(
            item =>
            item.includes("wallet")
            ||
            item.includes("address")
          );



        if(!hasWallet){

          throw new Error(
            "missing wallet field"
          );

        }








        const uploadInfo={


          fileName:
          file.name,


          rows:
          rows.length,


          columns:
          Object.keys(rows[0]),


          status:
          "success",


          uploadTime:
          new Date().toISOString()


        };






        sessionStorage.setItem(

          "uploadData",

          JSON.stringify(uploadInfo)

        );






        setProgress(100);



        setTimeout(()=>{


          setUploadStatus(
            "success"
          );


        },500);




      }


      catch(error){


        console.log(error);


        setUploadStatus(
          "failed"
        );


      }


    };







    reader.onerror=()=>{


      setUploadStatus(
        "failed"
      );


    };





    // 支持csv/xlsx

    if(file.name.endsWith(".xlsx")){


      reader.readAsArrayBuffer(file);


    }else{


      reader.readAsText(file);


    }



  }








  // ==========================
  // 成功后确认分析
  // ==========================

  async function confirmAnalysis(){



    if(!selectedFile){


      console.log(
        "没有文件"
      );


      return;


    }




    try{


      const wallet =
        getWallet();




      if(!wallet){


        alert(
          "请先连接钱包"
        );



        navigate("/");


        return;


      }





      console.log(
        "开始调用后端:",
        selectedFile.name
      );



      setUploadStatus(
        "processing"
      );






      // ==========================
      // 调用v5后端分析接口
      // ==========================


      const result =
        await analyzeData(

          selectedFile,

          wallet

        );





      console.log(
        "后端返回:",
        result
      );





      setAnalysisResult(
        result
      );





      sessionStorage.setItem(

        "analysisResult",

        JSON.stringify(result)

      );






      if(result.report_id){


        sessionStorage.setItem(

          "reportId",

          result.report_id

        );


      }






      setUploadStatus(

        "success-analysis"

      );



    }


    catch(error){


      console.error(
        "分析失败:",
        error
      );



      setUploadStatus(
        "failed"
      );


    }


  }







  return (


    <div className="page page-upload">


      <div className="page-title">

        上传用户数据

      </div>





      <div className="upload-actions">



        {/* 数据源 */}


        <div className="action-card glass-card">


          <h3>

            连接数据源

          </h3>



          <p>

            未来支持 Monad RPC 与 DApp 数据接入。

          </p>


        </div>







        {/* 本地上传 */}



        <div


          className="action-card glass-card upload-card"


          onClick={
            uploadStatus==="idle"
            ?
            handleUploadClick
            :
            undefined
          }


        >




          {
            uploadStatus==="idle" && (

              <>


                <h3>

                  本地上传

                </h3>



                <p>

                  上传包含钱包行为数据的 CSV / XLSX 文件。

                </p>


              </>


            )
          }







          {
            uploadStatus==="reading" && (

              <>


                <h3>

                  读取数据中

                </h3>




                <div className="upload-progress">


                  <div

                    className="upload-progress-bar"

                    style={{

                      width:
                      `${progress}%`

                    }}

                  />

                </div>


              </>


            )
          }








          {
            uploadStatus==="success" && (


              <>


                <h3 className="success-text">

                  数据读取成功

                </h3>



                <button

                  className="upload-confirm-btn"

                  onClick={(e)=>{


                    e.stopPropagation();


                    confirmAnalysis();


                  }}


                >

                  确认分析并上链


                </button>


              </>


            )
          }









          {
            uploadStatus==="processing" && (


              <>


                <h3>

                  正在分析数据

                </h3>



                <p>

                  AI 正在生成增长分析报告...

                </p>


              </>


            )
          }








          {
            uploadStatus==="success-analysis" && (


              <>


                <h3 className="success-text">

                  分析完成

                </h3>



                <p className="upload-chain-status">

                  ✓ 链上交易成功

                </p>



                <p className="upload-chain-hash">

                  Transaction Hash:

                  <br />

                  0x8f3a...92cd


                </p>




                <button

                  className="upload-confirm-btn"

                  onClick={()=>{


                    navigate("/reports");


                  }}


                >

                  查看报告


                </button>


              </>


            )
          }









          {
            uploadStatus==="failed" && (


              <>


                <h3 className="failed-text">

                  数据读取失败

                </h3>



                <button

                  className="upload-confirm-btn"

                  onClick={()=>{


                    setUploadStatus(
                      "idle"
                    );


                  }}


                >

                  重新上传


                </button>


              </>


            )
          }






        </div>




      </div>







      <p className="upload-tip">

        通过连接数据源或上传 CSV，开始增长分析流程。

      </p>






      <input

        ref={fileInputRef}

        type="file"

        accept=".csv,.xlsx"

        hidden

        onChange={
          handleFileChange
        }


      />





    </div>


  );

}


export default Upload;