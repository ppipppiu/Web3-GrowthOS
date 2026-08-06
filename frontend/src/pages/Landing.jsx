import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="page page-landing glass-panel">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Monad Growth Intelligence</span>
          <h1>面向 Monad 生态 DApp 的链上增长智能分析平台</h1>
          <p>
            通过钱包身份、链上行为数据和 AI 分析，帮助 Web3 项目实现用户增长
            和运营决策。
          </p>
          <Link to="/upload" className="primary-button">
            连接钱包
          </Link>
        </div>
        <div className="hero-preview glass-card">
          <div className="preview-header">增长概览</div>
          <div className="preview-grid">
            <div className="preview-metric">活跃钱包</div>
            <div className="preview-metric">留存</div>
          </div>
        </div>
      </section>
      <section className="info-section">
        <div className="info-card glass-card">
          <h2>平台功能</h2>
          <p>
            可视化项目增长、用户分层、行为漏斗分析，生成链上可验证的报告。
          </p>
        </div>
        <div className="info-card glass-card">
          <h2>使用流程</h2>
          <ul>
            <li>连接钱包</li>
            <li>上传或接入用户数据</li>
            <li>查看分析结果</li>
            <li>导出报告</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Landing;
