import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Landing from "./pages/Landing";
import Upload from "./pages/Upload";
import Workspace from "./pages/Workspace";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";

import Segmentation from "./pages/Segmentation";
import ValueDefinition from "./pages/ValueDefinition";

import Activation from "./pages/segmentation/Activation";
import ValueAnalysis from "./pages/segmentation/ValueAnalysis";
import Retention from "./pages/segmentation/Retention";
import SybilDetection from "./pages/segmentation/SybilDetection";

import Navbar from "./components/Navbar";
import BackButton from "./components/BackButton";
import WalletAvatar from "./components/WalletAvatar";

import { getWallet } from "./blockchain/wallet";

function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    const current = sessionStorage.getItem("currentPath");

    if (current) {
      sessionStorage.setItem("previousPath", current);
    }

    sessionStorage.setItem("currentPath", location.pathname);
  }, [location]);

  return null;
}

function App() {
  const [walletConnected, setWalletConnected] = useState(false);

  // =========================
  // 加载钱包状态
  // =========================

  function loadWalletStatus() {
    const wallet = getWallet();

    setWalletConnected(Boolean(wallet));
  }

  // =========================
  // 初始化 + 钱包状态监听
  // =========================

  useEffect(() => {
    loadWalletStatus();

    const handleWalletChanged = () => {
      loadWalletStatus();
    };

    window.addEventListener("walletChanged", handleWalletChanged);

    return () => {
      window.removeEventListener("walletChanged", handleWalletChanged);
    };
  }, []);

  return (
    <div className="app-shell">
      {walletConnected && (
        <>
          <Navbar />

          <BackButton />

          <WalletAvatar />
        </>
      )}

      <main className="page-frame">
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route path="/upload" element={<Upload />} />

          <Route path="/workspace" element={<Workspace />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/reports" element={<Reports />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/segmentation" element={<Segmentation />} />

          <Route path="/value-definition" element={<ValueDefinition />} />

          <Route path="/segmentation/activation" element={<Activation />} />

          <Route
            path="/segmentation/value-analysis"
            element={<ValueAnalysis />}
          />

          <Route path="/segmentation/retention" element={<Retention />} />

          <Route
            path="/segmentation/sybil-detection"
            element={<SybilDetection />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
