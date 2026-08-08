import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Landing from "./pages/Landing";
import Upload from "./pages/Upload";
import Workspace from "./pages/Workspace";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import ReportDetail from "./pages/ReportDetail";
import Profile from "./pages/Profile";
import Agent from "./pages/Agent";

import Segmentation from "./pages/Segmentation";
import ValueDefinition from "./pages/ValueDefinition";

import GrowthCenter from "./pages/GrowthCenter";
import GrowthAnalysisResult from "./pages/GrowthAnalysisResult";

import Activation from "./pages/segmentation/Activation";
import ValueAnalysis from "./pages/segmentation/ValueAnalysis";
import Retention from "./pages/segmentation/Retention";
import SybilDetection from "./pages/segmentation/SybilDetection";

import Navbar from "./components/Navbar";
import BackButton from "./components/BackButton";
import WalletAvatar from "./components/WalletAvatar";
import SegmentBuilder from "./pages/segmentation/SegmentBuilder";
import SegmentResult from "./pages/segmentation/SegmentResult";
import { Navigate } from "react-router-dom";

import { getWallet } from "./blockchain/wallet";


// =============================
// 页面路径记录
// 用于返回按钮
// =============================

function RouteTracker() {

    const location = useLocation();


    useEffect(() => {

        const current =
            sessionStorage.getItem(
                "currentPath"
            );


        if (current) {

            sessionStorage.setItem(
                "previousPath",
                current
            );

        }


        sessionStorage.setItem(
            "currentPath",
            location.pathname
        );


    }, [location]);


    return null;

}





function App() {


    const [
        walletConnected,
        setWalletConnected
    ] = useState(false);



    // =============================
    // 检查钱包状态
    // =============================

    function loadWalletStatus() {


        const wallet = getWallet();


        setWalletConnected(
            Boolean(wallet)
        );


    }





    // =============================
    // 初始化钱包监听
    // =============================

    useEffect(() => {


        loadWalletStatus();



        const handleWalletChanged = () => {

            loadWalletStatus();

        };



        window.addEventListener(
            "walletChanged",
            handleWalletChanged
        );



        return () => {


            window.removeEventListener(
                "walletChanged",
                handleWalletChanged
            );


        };


    }, []);






    return (

        <div className="app-shell">


            {
                walletConnected && (

                    <>


                        <Navbar />


                        <BackButton />


                        <WalletAvatar />


                    </>

                )
            }





            <main className="page-frame">


                <RouteTracker />



                <Routes>


                    {/* 登录入口 */}

                    <Route

                        path="/"

                        element={
                            <Landing />
                        }

                    />




                    {/* 上传 */}

                    <Route

                        path="/upload"

                        element={
                            <Upload />
                        }

                    />

                    {/* AI Agent */}

                    <Route
                        path="/agent"
                        element={
                            <Agent />
                        }
                    />

                    <Route

                    path="/segment-result"

                    element={
                    <SegmentResult/>
                    }

                    />




                    {/* 工作区 */}

                    <Route

                        path="/workspace"

                        element={
                            <Workspace />
                        }

                    />





                    {/* Dashboard 使用v5 */}

                    <Route

                    path="/dashboard"

                    element={
                    walletConnected

                    ?

                    <Dashboard/>

                    :

                    <Navigate to="/" replace/>

                    }

                    />

                    
                    <Route

                        path="/segment-builder"

                        element={
                            <SegmentBuilder/>
                        }

                    />




                    {/* 报告 */}

                    <Route

                        path="/reports"

                        element={
                            <Reports />
                        }

                    />

                    <Route

                    path="/report/:id"

                    element={<ReportDetail/>}

                    />



                    {/* 用户主页 */}

                    <Route

                        path="/profile"

                        element={
                            <Profile />
                        }

                    />




                    {/* 用户价值定义 */}

                    <Route

                        path="/value-definition"

                        element={
                            <ValueDefinition />
                        }

                    />






                    {/* 用户分层 */}

                    <Route

                        path="/segmentation"

                        element={
                            <Segmentation />
                        }

                    />





                    <Route

                        path="/segmentation/activation"

                        element={
                            <Activation />
                        }

                    />





                    <Route

                        path="/segmentation/value-analysis"

                        element={
                            <ValueAnalysis />
                        }

                    />





                    <Route

                        path="/segmentation/retention"

                        element={
                            <Retention />
                        }

                    />





                    <Route

                        path="/segmentation/sybil-detection"

                        element={
                            <SybilDetection />
                        }

                    />







                    {/*

                        v5新增

                        增长分析中心

                        根据分析类型展示AI策略

                    */}

                    <Route

                        path="/growth/:type"

                        element={
                            <GrowthCenter />
                        }

                    />


                    <Route

                    path="/growth-analysis/:type"

                    element={
                    <GrowthAnalysisResult/>
                    }

                    />



                </Routes>



            </main>


        </div>


    );


}


export default App;