import { useState } from "react";
import { uploadAnalysis } from "../blockchain/contract";
import { connectWallet } from "../blockchain/wallet";
import { useNavigate } from "react-router-dom";


function Upload() {

    const navigate = useNavigate();

    const [wallet, setWallet] = useState("");
    const [txHash, setTxHash] = useState("");
    const [loading, setLoading] = useState(false);


    //连接钱包
    const handleConnect = async()=>{

        const address = await connectWallet();

        if(address){
            setWallet(address);
        }

    }



    //上传并触发链上交易
    const handleUpload = async()=>{

        try{

            setLoading(true);


            //调用合约
            const hash = await uploadAnalysis(
                "sample_onchain_transactions.csv"
            );


            setTxHash(hash);


            alert(
                "链上交易成功!"
            );


            //跳转workspace
            navigate("/workspace");


        }catch(error){

            console.log(error);

            alert(
                "交易失败"
            );

        }


        setLoading(false);

    }



    return (

    <div className="page page-upload glass-panel">


        <div className="page-title">
            上传用户数据
        </div>


        <div className="upload-panel glass-card">


            <div className="upload-intro">

                <p>
                    上传链上行为数据，
                    开始用户增长分析流程。
                </p>


            </div>



            {
                wallet ? (

                    <p>
                        钱包:
                        {wallet.slice(0,6)}
                        ...
                        {wallet.slice(-4)}
                    </p>

                ):(
                    <button
                    className="primary-button"
                    onClick={handleConnect}
                    >
                        连接钱包
                    </button>
                )
            }



            <button
            className="primary-button"
            onClick={handleUpload}
            disabled={loading}
            >

            {
                loading
                ?
                "交易处理中..."
                :
                "上传数据并支付Gas"

            }

            </button>



            {
                txHash &&

                <p>
                    Transaction Hash:
                    {txHash}
                </p>

            }



        </div>


    </div>

    );

}


export default Upload;