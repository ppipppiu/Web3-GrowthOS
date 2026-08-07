import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import GrowthTrendChart from "../components/charts/GrowthTrendChart";

import UserDistributionChart from "../components/charts/UserDistributionChart";

import FunnelChart from "../components/charts/FunnelChart";

import ValueChart from "../components/charts/ValueChart";

function Dashboard() {
  const navigate = useNavigate();

  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    const result = sessionStorage.getItem("analysisResult");

    console.log("dashboard result:", result);

    if (result) {
      setAnalysisData(JSON.parse(result));
    }
  }, []);

  if (!analysisData) {
    return (
      <div className="page-container">
        <div className="glass-card upload-card">
          <h2>暂无分析数据</h2>

          <p>请上传链上数据生成增长分析报告</p>
        </div>
      </div>
    );
  }

  const analysis = analysisData.analysis || {};

  const metrics = analysis.metrics || {};

  const segmentation = analysis.segmentation || {};

  // =======================
  // Dashboard 数据转换层
  // =======================

  const overview = {
    total_users: metrics.total_users || metrics.wallet_count || 0,

    active_users: metrics.active_users || 0,

    total_events: metrics.total_transactions || metrics.transaction_count || 0,

    total_value: metrics.total_volume_usd || metrics.total_value || 0,
  };

  const trend = metrics.trend || [];

  const distribution = Array.isArray(segmentation)
    ? segmentation
    : Object.entries(segmentation || {}).map(([name, count]) => ({
        name,
        count,
      }));

  const retentionRate = metrics.retention_rate || 0;

  /*
        当前价值模型

        后续由 Value Definition 页面提供

    */

  const valueModel = metrics.value_model || {
    volume: 40,

    activity: 30,

    retention: 20,

    transaction: 10,
  };

  const activationRate = overview.total_users
    ? ((overview.active_users / overview.total_users) * 100).toFixed(1)
    : 0;

  const analysisEntry = [
    {
      title: "🚀 用户激活分析",

      description: "分析用户完成首次链上行为的原因，定位激活阻碍用户",

      path: "/segmentation/activation",
    },

    {
      title: "💰 用户价值分析",

      description: "基于自定义价值模型识别核心贡献用户",

      path: "/segmentation/value-analysis",
    },

    {
      title: "🔄 用户留存分析",

      description: "分析用户流失风险和长期活跃情况",

      path: "/segmentation/retention",
    },

    {
      title: "🛡 Sybil风险检测",

      description: "识别异常钱包行为和潜在机器人用户",

      path: "/segmentation/sybil-detection",
    },
  ];

  return (
    <div className="page-container">
      {/* Header */}

      <div className="page-title">Monad Growth Intelligence</div>

      <div className="page-description">Web3 用户增长状态总览与分析入口</div>

      {/* Growth Overview */}

      <div className="page-title">Growth Overview</div>

      <div className="dashboard-grid">
        {[
          ["钱包用户", overview.total_users || 0, "Wallets"],

          ["活跃钱包", overview.active_users || 0, "Active"],

          ["链上交易", overview.total_events || 0, "Transactions"],

          [
            "交易价值",

            Number(overview.total_value || 0).toLocaleString(),

            "MON",
          ],

          ["激活率", activationRate + "%", "Activation"],

          ["留存率", retentionRate + "%", "Retention"],
        ].map((item, index) => (
          <div className="metric-card glass-card" key={index}>
            <div className="metric-title">{item[0]}</div>

            <div className="metric-value">{item[1]}</div>

            <span>{item[2]}</span>
          </div>
        ))}
      </div>

      {/* Growth Trend */}

      <div className="page-title">Growth Trend</div>

      <GrowthTrendChart data={trend} />

      {/* Funnel */}

      <div className="page-title">User Funnel</div>

      <FunnelChart data={[]} />

      <div className="page-title">User Value Overview</div>

      <ValueChart data={[]} />

      {/* Value Model */}

      <div className="page-title">User Value Model</div>

      <div className="glass-card metric-card">
        <h3>当前价值评估规则</h3>

        <p>
          Volume：
          {valueModel.volume}%
        </p>

        <p>
          Activity：
          {valueModel.activity}%
        </p>

        <p>
          Retention：
          {valueModel.retention}%
        </p>

        <p>
          Transaction：
          {valueModel.transaction}%
        </p>

        <button
          className="primary-button"
          onClick={() => navigate("/value-definition")}
        >
          修改价值模型
        </button>
      </div>

      {/* User Segmentation */}

      <div className="page-title">User Segmentation</div>

      <UserDistributionChart data={distribution} />

      {/* Analysis Center */}

      <div className="page-title">Growth Analysis Center</div>

      <div className="segmentation-grid">
        {analysisEntry.map((item) => (
          <div className="glass-card segment-card" key={item.path}>
            <h3>{item.title}</h3>

            <p>{item.description}</p>

            <button
              className="primary-button"
              onClick={() => navigate(item.path)}
            >
              查看分析
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
