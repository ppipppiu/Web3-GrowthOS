import {
  useEffect,
  useState
} from "react";


import {
  useNavigate
} from "react-router-dom";


import {
  getWallet
} from "../blockchain/wallet";


import {
  getReports
} from "../utils/reportStorage";





function Reports() {


  const navigate =
    useNavigate();



  const [
    reports,
    setReports
  ] = useState([]);




  const [
    loading,
    setLoading
  ] = useState(true);




  const [
    wallet,
    setWallet
  ] = useState("");







  async function loadReports(){



    try{


      const address =
        getWallet();




      if(!address){


        setLoading(false);

        return;


      }





      setWallet(address);





      let finalReports=[];





      // ==========================
      // 优先读取后端数据
      // ==========================

      try{


        const response =
          await fetch(

            `http://localhost:8000/api/reports/${address}`

          );



        if(response.ok){


          const data =
            await response.json();



          finalReports =
            data.reports || data || [];


        }


      }
      catch(error){


        console.log(
          "后端报告读取失败，使用本地数据"
        );


      }







      // ==========================
      // 后端无数据
      // 使用localStorage
      // ==========================


      if(
        !finalReports ||
        finalReports.length===0
      ){


        finalReports =
          getReports(address);


      }





      setReports(
        finalReports
      );



    }


    catch(error){


      console.error(
        "加载报告失败:",
        error
      );


    }


    finally{


      setLoading(false);


    }


  }








  useEffect(()=>{


    loadReports();


  },[]);








  return (


    <div className="page page-reports">



      <h1 className="page-title">

        我的分析报告

      </h1>






      <div className="profile-panel glass-card">


        <div className="profile-row">


          <span>

            当前钱包

          </span>



          <strong>

            {
              wallet

              ?

              wallet.slice(0,6)
              +
              "..."
              +
              wallet.slice(-4)


              :

              "未连接"

            }

          </strong>


        </div>







        <div className="profile-row">


          <span>

            历史报告数量

          </span>



          <strong>

            {reports.length}

          </strong>


        </div>



      </div>









      <div className="report-list">


        {


        loading ?


        (

          <div className="report-item glass-card">

            加载报告中...

          </div>


        )



        :



        reports.length===0 ?



        (

          <div className="report-item glass-card">

            暂无分析报告


          </div>


        )



        :



        reports.map(

          (report,index)=>(



            <div

              className="report-item glass-card"

              key={
                report.id
                ||
                report.report_id
                ||
                index
              }


            >



              <h3>

                分析报告 {index+1}


              </h3>






              <p>

                类型：

                {
                  report.type
                  ||
                  "链上增长分析"

                }

              </p>






              <p>

                文件：

                {
                  report.file?.filename
                  ||
                  report.filename
                  ||
                  "用户上传数据"

                }


              </p>






              <p>

                分析时间：

                {
                  report.created_at
                  ||
                  report.time
                  ||
                  report.createdAt
                }


              </p>







              <button

                onClick={()=>{


                  navigate(

                    `/dashboard?report=${
                      report.id
                      ||
                      report.report_id
                    }`

                  );


                }}

              >

                查看报告


              </button>





            </div>


          )


        )


        }



      </div>



    </div>


  );


}


export default Reports;