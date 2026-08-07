import {
  useEffect,
  useState
} from "react";


import {
  Eye,
  EyeOff,
  Copy
} from "lucide-react";


import {
  Link,
  useNavigate
} from "react-router-dom";


import {

  getWallet,

  getBalance,

  getNetwork,

  getConnectTime,

  disconnectWallet,

} from "../blockchain/wallet";



import {

  getReports

} from "../utils/reportStorage";







function Profile() {


  const navigate =
    useNavigate();



  const [
    address,
    setAddress
  ] = useState("");



  const [
    balance,
    setBalance
  ] = useState("0 MON");



  const [
    network,
    setNetwork
  ] = useState("");



  const [
    connectTime,
    setConnectTime
  ] = useState("");



  const [
    showAddress,
    setShowAddress
  ] = useState(false);





  const [
    reportCount,
    setReportCount
  ] = useState(0);




  const [
    lastAnalysisTime,
    setLastAnalysisTime
  ] = useState("--");





  const isConnected =
    Boolean(address);








  function loadReports(wallet){


    const reports =
      getReports(wallet);




    setReportCount(

      reports.length

    );





    if(reports.length>0){


      const latest =
        reports[
          reports.length-1
        ];



      setLastAnalysisTime(

        latest.created_at
        ||
        latest.createdAt
        ||
        "--"

      );


    }
    else{


      setLastAnalysisTime(
        "--"
      );


    }


  }







  async function loadWallet(){



    const wallet =
      getWallet();




    if(wallet){



      setAddress(wallet);



      const bal =
        await getBalance();



      setBalance(bal);




      const net =
        await getNetwork();



      setNetwork(net);




      setConnectTime(
        getConnectTime()
      );




      loadReports(wallet);



    }

    else{



      setAddress("");

      setBalance(
        "0 MON"
      );

      setNetwork("");

      setConnectTime("");

      setShowAddress(false);


    }


  }








  useEffect(()=>{


    loadWallet();



  },[]);








  useEffect(()=>{


    const updateWallet = ()=>{


      loadWallet();


    };



    window.addEventListener(

      "walletChanged",

      updateWallet

    );




    return ()=>{


      window.removeEventListener(

        "walletChanged",

        updateWallet

      );


    };


  },[]);








  useEffect(()=>{


    if(!window.ethereum){

      return;

    }




    const handleAccountsChanged =
      (accounts)=>{


        if(accounts.length){


          loadWallet();


        }
        else{


          setAddress("");

        }


      };





    window.ethereum.on(

      "accountsChanged",

      handleAccountsChanged

    );





    return ()=>{


      window.ethereum.removeListener(

        "accountsChanged",

        handleAccountsChanged

      );


    };



  },[]);








  useEffect(()=>{


    if(!window.ethereum){

      return;

    }



    const handleChainChanged = ()=>{


      getNetwork()
      .then(setNetwork);


    };




    window.ethereum.on(

      "chainChanged",

      handleChainChanged

    );




    return ()=>{


      window.ethereum.removeListener(

        "chainChanged",

        handleChainChanged

      );


    };



  },[]);








  const shortAddress =

    address

    ?

    address.slice(0,6)
    +
    "..."
    +
    address.slice(-4)

    :

    "未连接";








  function copyAddress(){


    if(!address){

      return;

    }



    navigator.clipboard.writeText(
      address
    );



    alert(
      "钱包地址已复制"
    );


  }








  return (


    <div className="page page-profile">



      <h1 className="page-title">

        个人中心

      </h1>






      <div className="profile-panel glass-card">



        <div className="profile-avatar-area">


          <div className="big-avatar">

            WG

          </div>


          <button>

            上传头像

          </button>


        </div>





        <h2>

          Wallet User

        </h2>





        <hr />





        <h2>

          钱包信息

        </h2>







        <div className="profile-row">


          <span>

            钱包地址

          </span>




          <strong>


          {
            showAddress

            ?

            address

            :

            shortAddress

          }




          <button

            className="icon-button"

            onClick={()=>


              setShowAddress(
                !showAddress
              )

            }

          >


          {

            showAddress

            ?

            <Eye size={18}/>

            :

            <EyeOff size={18}/>


          }


          </button>




          <button

            className="icon-button"

            onClick={copyAddress}

          >

            <Copy size={18}/>


          </button>




          </strong>


        </div>








        <div className="profile-row">


          <span>

            账户余额

          </span>



          <strong>

            {balance}

          </strong>



        </div>







        {
          isConnected &&

          (

          <div className="profile-row">


            <span>

              当前网络

            </span>



            <strong>

              {network}

            </strong>


          </div>

          )
        }







        {
          isConnected &&

          (

          <div className="profile-row">


            <span>

              连接时间

            </span>



            <strong>

              {connectTime}

            </strong>


          </div>

          )
        }






      </div>








      {
        isConnected &&

        (

        <div className="profile-panel glass-card">


          <h2>

            分析记录

          </h2>






          <div className="profile-row">


            <span>

              历史分析报告

            </span>



            <Link

              to="/reports"

              className="report-count"

            >

              {reportCount}

            </Link>



          </div>








          <div className="profile-row">


            <span>

              最近分析时间

            </span>



            <strong>

              {lastAnalysisTime}

            </strong>



          </div>








          <button

            className="wallet-menu-item"

            onClick={()=>{


              disconnectWallet();



              navigate(
                "/",
                {
                  replace:true
                }
              );


            }}

          >

            断开钱包


          </button>





        </div>

        )

      }




    </div>


  );


}


export default Profile;