import {
    useEffect,
    useState
} from "react";


import {
    getWallet,
    disconnectWallet
} from "../blockchain/wallet";


import {
    useNavigate
} from "react-router-dom";



function Profile(){


    const navigate =
        useNavigate();



    const [
        wallet,
        setWallet
    ] = useState("");



    const [
        shortAddress,
        setShortAddress
    ] = useState(true);



    const [
        copied,
        setCopied
    ] = useState(false);



    const [
        balance,
        setBalance
    ] = useState("--");



    const [
        network,
        setNetwork
    ] = useState("--");



    const [
        reportCount,
        setReportCount
    ] = useState(0);



    const [
        lastTime,
        setLastTime
    ] = useState("--");







    // =====================
    // 初始化钱包
    // =====================

    useEffect(()=>{


        const address =
            getWallet();



        if(!address){

            return;

        }


        setWallet(address);



        loadProfile(address);



    },[]);







    // =====================
    // 获取后端用户报告数据
    // =====================

    async function loadProfile(address){


        try{


            const response =
                await fetch(

                    `http://localhost:8000/api/profile/${address}`

                );



            if(!response.ok){

                return;

            }



            const data =
                await response.json();





            setReportCount(

                data.report_count || 0

            );




            setLastTime(

                data.last_analysis_time || "--"

            );



        }


        catch(error){


            console.error(
                "Profile读取失败",
                error
            );


        }



    }









    // =====================
    // 钱包余额
    // =====================

    async function loadBalance(){


        if(!window.ethereum){

            return;

        }



        const accounts =
            await window.ethereum.request({

                method:
                "eth_accounts"

            });



        if(!accounts.length){

            return;

        }



        const balance =
            await window.ethereum.request({

                method:
                "eth_getBalance",

                params:[
                    accounts[0],
                    "latest"
                ]

            });



        const value =
            parseInt(
                balance,
                16
            )
            /
            10**18;



        setBalance(

            value.toFixed(4)

        );



    }







    // =====================
    // 网络信息
    // =====================

    async function loadNetwork(){


        if(!window.ethereum){

            return;

        }



        const chain =
            await window.ethereum.request({

                method:
                "eth_chainId"

            });



        setNetwork(chain);



    }





    useEffect(()=>{


        if(wallet){


            loadBalance();

            loadNetwork();


        }


    },[wallet]);









    // =====================
    // 复制地址
    // =====================

    async function copyAddress(){


        await navigator.clipboard.writeText(

            wallet

        );



        setCopied(true);



        setTimeout(()=>{


            setCopied(false);


        },1500);



    }









    // =====================
    // 断开钱包
    // =====================

    function handleDisconnect(){



        disconnectWallet();



        setWallet("");



        navigate("/");



    }









    return (


        <div className="profile-page">



            <div className="profile-card">





                <h2>
                    个人中心
                </h2>






                {
                    !wallet ?


                    (

                        <div>


                            <p>
                                当前未连接钱包
                            </p>



                        </div>


                    )


                    :

                    (

                    <>


                    <div className="wallet-info">


                        <h3>
                            钱包账户
                        </h3>



                        <p>


                            {

                            shortAddress

                            ?

                            `${wallet.slice(0,6)}
                            ...
                            ${wallet.slice(-4)}`

                            :

                            wallet

                            }


                        </p>



                        <button

                            onClick={()=>
                                setShortAddress(
                                    !shortAddress
                                )
                            }

                        >

                            切换地址

                        </button>





                        <button

                            onClick={
                                copyAddress
                            }

                        >

                            {
                                copied

                                ?

                                "已复制"

                                :

                                "复制"

                            }


                        </button>




                    </div>






                    <div className="profile-stat">


                        <p>
                            网络：
                            {network}
                        </p>


                        <p>
                            余额：
                            {balance}
                        </p>



                        <p>
                            分析报告数量：
                            {reportCount}
                        </p>



                        <p>
                            最近分析时间：
                            {lastTime}
                        </p>



                    </div>






                    <button

                        onClick={()=>{

                            navigate(
                                "/reports"
                            );

                        }}

                    >

                        查看历史报告

                    </button>






                    <button

                        onClick={
                            handleDisconnect
                        }

                    >

                        断开钱包

                    </button>



                    </>


                    )


                }





            </div>



        </div>


    );



}



export default Profile;