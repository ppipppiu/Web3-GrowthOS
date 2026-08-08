import { useNavigate } from "react-router-dom";

import { connectWallet } from "../blockchain/wallet";

function Landing() {
  const navigate = useNavigate();

  async function handleConnectWallet() {
    try {
      const address = await connectWallet();

      if (address) {
        navigate("/upload", {
          replace: true,
        });
      }
    } catch (error) {
      console.log("Connect wallet error:", error);
    }
  }

  const capabilities = [
    {
      index: "01",
      title: "数据接入与治理",
      description:
        "支持 CSV / XLSX 交易数据上传，并完成字段校验、数据清洗与标准化，为增长分析建立统一数据基础。",
    },
    {
      index: "02",
      title: "增长分析与用户分层",
      description:
        "从活跃度、交易频次、交易金额、行为漏斗、激活与用户价值等维度识别不同类型的钱包用户。",
    },
    {
      index: "03",
      title: "留存与 Sybil 风险识别",
      description:
        "分析用户留存表现与异常交易特征，辅助识别潜在 Sybil 钱包，提升增长数据质量与运营判断可靠性。",
    },
    {
      index: "04",
      title: "AI 策略与链上报告",
      description:
        "基于分析结果生成增长洞察与策略建议，并通过 Agent 解读报告；关键分析结果可记录 Monad Testnet 交易 Hash。",
    },
  ];

  return (
    <div className="page page-landing glass-panel">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">MONAD GROWTH INTELLIGENCE</span>

          <h1>面向 Monad 生态 DApp 的链上增长智能分析平台</h1>

          <button className="primary-button" onClick={handleConnectWallet}>
            连接钱包
          </button>
        </div>
      </section>

      <section className="platform-overview-card glass-card">
        <div className="platform-overview-copy">
          <span className="section-kicker">PLATFORM OVERVIEW</span>

          <h2>平台介绍</h2>

          <p className="platform-lead">
            连接钱包、导入链上行为数据，通过用户分层、留存分析、风险识别与 AI
            策略生成，帮助 Web3 项目更高效地理解用户并制定增长运营决策。
          </p>

          <p className="platform-note">
            从数据接入、分析洞察到策略生成与链上存证，形成面向 Monad
            生态项目的一体化增长分析流程。
          </p>
        </div>

        <div className="platform-capability-list">
          {capabilities.map((capability) => (
            <div className="platform-capability-item" key={capability.index}>
              <span className="platform-capability-index">
                {capability.index}
              </span>

              <div>
                <h3>{capability.title}</h3>
                <p>{capability.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Landing;
