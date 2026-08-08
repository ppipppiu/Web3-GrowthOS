import { useEffect, useMemo, useState } from "react";
import { generateStrategy } from "../../api/ai";

const SEGMENTS = [
  {
    key: "未连接钱包用户",
    name: "未连接钱包用户",
    description: "尚未完成钱包连接，仍处于链上用户激活漏斗最前端。",
  },
  {
    key: "已连接未交易用户",
    name: "已连接未交易用户",
    description: "已经连接钱包，但尚未完成第一次链上交易。",
  },
  {
    key: "首次交易用户",
    name: "首次交易用户",
    description: "已经完成第一次链上交易，但还没有形成持续交互行为。",
  },
  {
    key: "激活用户",
    name: "激活用户",
    description: "已完成多次链上交易，具备持续参与项目生态的基础。",
  },
];

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function isWalletConnected(user) {
  const explicitValue =
    user.wallet_connected ??
    user.is_wallet_connected ??
    user.connected ??
    user.walletConnected;

  if (explicitValue !== undefined && explicitValue !== null) {
    if (typeof explicitValue === "boolean") return explicitValue;

    const normalized = String(explicitValue).trim().toLowerCase();
    if (["false", "0", "no", "未连接", "disconnected"].includes(normalized)) {
      return false;
    }
    if (["true", "1", "yes", "已连接", "connected"].includes(normalized)) {
      return true;
    }
  }

  return Boolean(user.wallet_address);
}

function getActivationStatus(user) {
  const connected = isWalletConnected(user);
  const txCount = toNumber(user.transaction_count);

  if (!connected) return "未连接钱包用户";
  if (txCount <= 0) return "已连接未交易用户";
  if (txCount === 1) return "首次交易用户";
  return "激活用户";
}

function buildProfile(segmentUsers, totalUsers) {
  const count = segmentUsers.length;
  const divisor = count || 1;

  return {
    user_count: count,
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

function Activation() {
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
      console.error("读取用户激活分析数据失败", error);
    }
  }, []);

  const activationUsers = useMemo(
    () => users.map((user) => ({ ...user, activation_status: getActivationStatus(user) })),
    [users]
  );

  const segmentData = useMemo(
    () =>
      SEGMENTS.map((segment) => {
        const segmentUsers = activationUsers.filter(
          (user) => user.activation_status === segment.key
        );

        return {
          ...segment,
          users: segmentUsers,
          profile: buildProfile(segmentUsers, activationUsers.length),
        };
      }),
    [activationUsers]
  );

  async function generateAIStrategy(segment) {
    setLoadingLevel(segment.key);

    try {
      const strategy = await generateStrategy("activation", {
        user_level: segment.name,
        segment_definition: segment.description,
        ...segment.profile,
      });

      setAiStrategies((previous) => ({
        ...previous,
        [segment.key]: strategy,
      }));
    } catch (error) {
      console.error("AI激活策略生成失败", error);
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
          <h2>暂无用户激活分析数据</h2>
          <p>请先上传链上交易数据并完成分析。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-segmentation analysis-module-page">
      <div className="glass-panel info-card analysis-module-header">
        <div className="page-title">用户激活分析</div>
        <p>分析用户从钱包连接到首次交易、持续交易的激活过程。</p>
      </div>

      <div className="section-title">用户分层结果</div>
      <div
        className="analysis-segment-summary-grid"
        style={{ "--segment-columns": SEGMENTS.length }}
      >
        {segmentData.map((segment) => (
          <div className="glass-card analysis-segment-summary-card" key={segment.key}>
            <div className="analysis-segment-summary-title">{segment.name}</div>
            <div className="analysis-segment-summary-number">{segment.profile.user_count}</div>
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
                {segment.profile.user_count} 人 · {segment.profile.user_share}%
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
                  {loadingLevel === segment.key ? "AI分析中..." : "生成AI激活策略"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Activation;
