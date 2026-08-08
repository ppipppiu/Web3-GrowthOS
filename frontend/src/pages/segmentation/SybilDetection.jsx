import { useEffect, useMemo, useState } from "react";
import { generateStrategy } from "../../api/ai";

const SEGMENTS = [
  {
    key: "正常钱包",
    name: "正常用户",
    description: "交易频率、价值和行为多样性暂未出现明显异常信号。",
  },
  {
    key: "可疑钱包",
    name: "可疑用户",
    description: "部分链上行为与普通用户存在差异，需要继续观察和验证。",
  },
  {
    key: "高风险钱包",
    name: "高风险钱包",
    description: "存在较强异常行为信号，应进入更严格的风控检查流程。",
  },
];

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function classifyRiskUsers(users) {
  const avgTransactions =
    users.reduce((sum, user) => sum + toNumber(user.transaction_count), 0) /
    (users.length || 1);

  return users.map((user) => {
    const txCount = toNumber(user.transaction_count);
    const volume = toNumber(user.total_volume);
    const tokens = toNumber(user.unique_tokens);
    const actions = toNumber(user.unique_actions);

    let risk = "正常钱包";
    let reason = "当前未发现明显异常行为信号";

    if (txCount > avgTransactions * 3 && volume < 500) {
      risk = "高风险钱包";
      reason = "交易频率显著偏高，但对应交易价值较低";
    } else if (
      txCount > avgTransactions * 2 ||
      actions <= 1 ||
      (tokens <= 1 && txCount > avgTransactions)
    ) {
      risk = "可疑钱包";
      reason = "交易频率或行为多样性与整体用户存在明显差异";
    }

    return {
      ...user,
      risk,
      risk_reason: reason,
    };
  });
}

function buildProfile(segmentUsers, totalUsers) {
  const count = segmentUsers.length;
  const divisor = count || 1;

  return {
    wallet_count: count,
    user_share: totalUsers ? Number(((count / totalUsers) * 100).toFixed(1)) : 0,
    avg_transaction_count: Number(
      (
        segmentUsers.reduce((sum, user) => sum + toNumber(user.transaction_count), 0) /
        divisor
      ).toFixed(2)
    ),
    avg_total_volume: Number(
      (
        segmentUsers.reduce((sum, user) => sum + toNumber(user.total_volume), 0) /
        divisor
      ).toFixed(2)
    ),
    avg_unique_actions: Number(
      (
        segmentUsers.reduce((sum, user) => sum + toNumber(user.unique_actions), 0) /
        divisor
      ).toFixed(2)
    ),
    avg_unique_tokens: Number(
      (
        segmentUsers.reduce((sum, user) => sum + toNumber(user.unique_tokens), 0) /
        divisor
      ).toFixed(2)
    ),
  };
}

function SybilDetection() {
  const [users, setUsers] = useState([]);
  const [aiStrategies, setAiStrategies] = useState({});
  const [loadingLevel, setLoadingLevel] = useState("");

  useEffect(() => {
    const result = localStorage.getItem("analysis_result");
    if (!result) return;

    try {
      const data = JSON.parse(result);
      setUsers(data.users || []);
    } catch (error) {
      console.error("读取 Sybil 风险分析数据失败", error);
    }
  }, []);

  const riskUsers = useMemo(() => classifyRiskUsers(users), [users]);

  const segmentData = useMemo(
    () =>
      SEGMENTS.map((segment) => {
        const segmentUsers = riskUsers.filter((user) => user.risk === segment.key);

        return {
          ...segment,
          users: segmentUsers,
          profile: buildProfile(segmentUsers, riskUsers.length),
        };
      }),
    [riskUsers]
  );

  async function generateAIStrategy(segment) {
    setLoadingLevel(segment.key);

    try {
      const strategy = await generateStrategy("sybil", {
        risk_level: segment.name,
        risk_description: segment.description,
        ...segment.profile,
      });

      setAiStrategies((previous) => ({
        ...previous,
        [segment.key]: strategy,
      }));
    } catch (error) {
      console.error("AI风控策略生成失败", error);
      setAiStrategies((previous) => ({
        ...previous,
        [segment.key]: "AI策略生成失败，请确认后端和本地 AI 服务已启动后重试。",
      }));
    } finally {
      setLoadingLevel("");
    }
  }

  if (users.length === 0) {
    return (
      <div className="page page-segmentation">
        <div className="glass-panel info-card">
          <h2>暂无风险检测数据</h2>
          <p>请先上传链上交易数据并完成分析。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-segmentation analysis-module-page">
      <div className="glass-panel info-card analysis-module-header">
        <div className="page-title">Sybil 风险检测</div>
        <p>基于钱包交易频率、交易价值和行为多样性识别异常风险信号。</p>
      </div>

      <div className="section-title">用户分层结果</div>
      <div
        className="analysis-segment-summary-grid"
        style={{ "--segment-columns": SEGMENTS.length }}
      >
        {segmentData.map((segment) => (
          <div className="glass-card analysis-segment-summary-card" key={segment.key}>
            <div className="analysis-segment-summary-title">{segment.name}</div>
            <div className="analysis-segment-summary-number">{segment.profile.wallet_count}</div>
            <div className="analysis-segment-summary-share">
              占比 {segment.profile.user_share}%
            </div>
          </div>
        ))}
      </div>

      <div className="section-title">分层用户画像与 AI 策略</div>
      <div className="analysis-segment-detail-grid">
        {segmentData.map((segment) => (
          <div className="glass-card analysis-segment-detail-card" key={segment.key}>
            <div className="analysis-segment-detail-header">
              <div>
                <h3>{segment.name}</h3>
                <p>{segment.description}</p>
              </div>
              <div className="analysis-segment-badge">
                {segment.profile.wallet_count} 个 · {segment.profile.user_share}%
              </div>
            </div>

            <div className="analysis-profile-title">用户画像</div>
            <div className="analysis-profile-metrics">
              <div>
                <span>平均交易次数</span>
                <strong>{segment.profile.avg_transaction_count}</strong>
              </div>
              <div>
                <span>平均交易价值</span>
                <strong>{segment.profile.avg_total_volume}</strong>
              </div>
              <div>
                <span>平均交互类型</span>
                <strong>{segment.profile.avg_unique_actions}</strong>
              </div>
              <div>
                <span>平均 Token 种类</span>
                <strong>{segment.profile.avg_unique_tokens}</strong>
              </div>
            </div>

            <div className="analysis-ai-panel">
              <div className="analysis-ai-title">AI 策略建议</div>
              {aiStrategies[segment.key] ? (
                <pre className="ai-result">{aiStrategies[segment.key]}</pre>
              ) : (
                <button
                  className="gradient-button"
                  disabled={loadingLevel === segment.key}
                  onClick={() => generateAIStrategy(segment)}
                >
                  {loadingLevel === segment.key ? "AI分析中..." : "生成AI风控策略"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SybilDetection;
