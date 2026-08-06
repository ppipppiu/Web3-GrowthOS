function Dashboard() {
  return (
    <div className="page page-dashboard glass-panel">
      <div className="page-title">用户增长数据看板</div>
      <div className="dashboard-grid">
        <div className="metric-card glass-card">
          <h3>钱包质量评分</h3>
          <p>88 / 100</p>
        </div>
        <div className="metric-card glass-card">
          <h3>用户分层</h3>
          <p>新用户 / 活跃 / 流失</p>
        </div>
        <div className="metric-card glass-card">
          <h3>留存</h3>
          <p>72%</p>
        </div>
        <div className="metric-card glass-card">
          <h3>活跃度</h3>
          <p>3.2 倍增长</p>
        </div>
      </div>
      <div className="dashboard-charts">
        <div className="chart-card glass-card">增长趋势</div>
        <div className="chart-card glass-card">用户行为漏斗</div>
        <div className="chart-card glass-card">分层分布</div>
      </div>
    </div>
  );
}

export default Dashboard;
