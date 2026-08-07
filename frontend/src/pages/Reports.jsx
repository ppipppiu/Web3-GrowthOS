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





      const response =
        await fetch(

          `http://localhost:8000/api/reports/${address}`

        );





      if(!response.ok){

        return;

      }





      const data =
        await response.json();





      setReports(

        data.reports || data

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
                report.report_id || index
              }


            >



              <h3>

                分析报告 {report.report_id}


              </h3>




              <p>

                文件：

                {
                  report.file?.filename
                  ||
                  report.filename
                }


              </p>




              <p>

                分析时间：

                {
                  report.created_at
                  ||
                  report.time
                }


              </p>






              <button

                onClick={()=>{


                  navigate(

                    `/dashboard?report=${report.report_id}`

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