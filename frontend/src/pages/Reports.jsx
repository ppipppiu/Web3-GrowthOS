import { useEffect, useState } from "react";

import { getWallet } from "../blockchain/wallet";

import { userData } from "../data/userData";

function Reports() {
  const [wallet, setWallet] = useState("");

  // 加载钱包状态
  function loadWallet() {
    const address = getWallet();

    setWallet(address || "");
  }

  useEffect(() => {
    // 初始化读取

    loadWallet();

    // 监听钱包连接/断开

    window.addEventListener("walletChanged", loadWallet);

    return () => {
      window.removeEventListener("walletChanged", loadWallet);
    };
  }, []);

  const reports = wallet ? userData.analysisReports : [];

  return (
    <div className="page page-reports">
      <h1 className="page-title">我的分析报告</h1>

      <div className="profile-panel glass-card">
        <div className="profile-row">
          <span>历史报告数量</span>

          <strong>{reports.length}</strong>
        </div>
      </div>

      <div className="report-list">
        {reports.length === 0 ? (
          <div className="report-item glass-card">暂无分析报告</div>
        ) : (
          reports.map((report, index) => (
            <div className="report-item glass-card" key={index}>
              <h3>{report.title || `分析报告 ${index + 1}`}</h3>

              <p>
                分析时间：
                {report.time}
              </p>

              <button>查看报告</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Reports;
