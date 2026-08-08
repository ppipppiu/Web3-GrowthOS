import { useEffect, useMemo, useState } from "react";
import { generateStrategy } from "../../api/ai";

const SEGMENTS = [
  {
    key: "活跃用户",
    name: "活跃用户",
    description: "最近 30 天内仍有链上行为，当前持续参与度较高。",
  },
  {
    key: "沉默用户",
    name: "沉默用户",
    description: "最近 31–60 天没有链上行为，活跃度开始下降。",
  },
  {
    key: "流失风险用户",
    name: "流失风险用户",
    description: "最近 61–90 天没有链上行为，已经出现明显流失风险。",
  },
  {
    key: "流失用户",
    name: "流失用户",
    description: "超过 90 天没有链上行为，当前处于长期不活跃状态。",
  },
];

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function parseDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getReferenceDate(users) {
  const validDates = users
    .map((user) => parseDate(user.last_transaction))
    .filter(Boolean);

  if (!validDates.length) return new Date();
  return new Date(Math.max(...validDates.map((date) => date.getTime())));
}

function getRetentionStatus(inactiveDays) {
  if (inactiveDays <= 30) return "活跃用户";
  if (inactiveDays <= 60) return "沉默用户";
  if (inactiveDays <= 90) return "流失风险用户";
  return "流失用户";
}

function buildProfile(segmentUsers, totalUsers) {
  const count = segmentUsers.length;
  const divisor = count || 1;

  return {
    user_count: count,
    user_share: totalUsers ? Number(((count / totalUsers) * 100).toFixed(1)) : 0,
    avg_inactive_days: Number(
      (
        segmentUsers.reduce((sum, user) => sum + toNumber(user.inactive_days), 0) /
        divisor
      ).toFixed(1)
    ),
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
  };
}

function Retention() {
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
      console.error("读取用户留存分析数据失败", error);
    }
  }, []);

  const retentionUsers = useMemo(() => {
    const referenceDate = getReferenceDate(users);

    return users.map((user) => {
      const lastTransaction = parseDate(user.last_transaction);
      const inactiveDays = lastTransaction
        ? Math.max(
            0,
            Math.floor((referenceDate - lastTransaction) / (1000 * 60 * 60 * 24))
          )
        : 999;

      return {
        ...user,
        inactive_days: inactiveDays,
        retention_status: getRetentionStatus(inactiveDays),
      };
    });
  }, [users]);

  const segmentData = useMemo(
    () =>
      SEGMENTS.map((segment) => {
        const segmentUsers = retentionUsers.filter(
          (user) => user.retention_status === segment.key
        );

        return {
          ...segment,
          users: segmentUsers,
          profile: buildProfile(segmentUsers, retentionUsers.length),
        };
      }),
    [retentionUsers]
  );

  async function generateAIStrategy(segment) {
    setLoadingLevel(segment.key);

    try {
      const strategy = await generateStrategy("retention", {
        user_level: segment.name,
        segment_definition: segment.description,
        ...segment.profile,
      });

      setAiStrategies((previous) => ({
        ...previous,
        [segment.key]: strategy,
      }));
    } catch (error) {
      console.error("AI留存策略生成失败", error);
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
          <h2>暂无用户留存分析数据</h2>
          <p>请先上传链上交易数据并完成分析。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-segmentation analysis-module-page">
      <div className="glass-panel info-card analysis-module-header">
        <div className="page-title">用户留存分析</div>
        <p>基于最近一次链上行为时间识别活跃、沉默和流失状态。</p>
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
                <span>平均未活跃天数</span>
                <strong>{segment.profile.avg_inactive_days}</strong>
              </div>
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
                  {loadingLevel === segment.key ? "AI分析中..." : "生成AI留存策略"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Retention;
