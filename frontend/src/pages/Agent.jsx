import { useState } from "react";
import ReactMarkdown from "react-markdown";

function Agent() {
  const [mode, setMode] = useState(null);
  const [reportMode, setReportMode] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "你好，我是 Growth Agent。\n\n我可以帮助你了解 GrowthOS 平台，也可以基于分析报告提供增长洞察。",
    },
  ]);

  const analysisTypes = [
    {
      name: "用户增长",
      prompt:
        "请分析当前 GrowthOS 报告中的用户增长问题，包括增长现状、核心原因和优化建议。",
    },
    {
      name: "用户留存",
      prompt:
        "请分析当前 GrowthOS 报告中的用户留存问题，包括留存表现、可能原因和优化建议。",
    },
    {
      name: "用户价值",
      prompt:
        "请分析当前 GrowthOS 报告中的用户价值情况，识别高价值用户特征并提供运营建议。",
    },
    {
      name: "风险检测",
      prompt:
        "请分析当前 GrowthOS 报告中的风险检测结果，包括异常用户和风险原因。",
    },
  ];

  async function sendMessage(question) {
    if (!question.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: question,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/agent/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          report: {
            source: "GrowthOS latest report",
          },
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "AI服务连接失败，请检查服务状态。",
        },
      ]);
    }

    setLoading(false);
  }

  function selectPlatform() {
    setMode("platform");
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "你想了解平台使用方法。你也可以继续直接提问，例如：“怎么上传数据？”、“分析流程是什么？”",
      },
    ]);
  }

  function selectReport() {
    setMode("report");
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "请选择你希望了解报告的方式。",
      },
    ]);
  }

  function selectOverview() {
    setReportMode("overview");
    sendMessage(
      "请整体分析当前 GrowthOS 报告，总结当前增长状态、核心发现和优化方向。",
    );
  }

  function selectDetail() {
    setReportMode("detail");
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "请选择你希望分析的问题类型。",
      },
    ]);
  }

  return (
    <div className="agent-page">
      <div className="agent-shell">
        {/* <div className="agent-hero">
          <div className="agent-title">Monad Growth Agent</div>
          <div className="agent-subtitle">
            AI 增长分析助手 · Web3 Growth Intelligence
          </div>
        </div> */}

        <div className="agent-chat-frame">
          <div className="chat-area">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.role === "user" ? "message user" : "message assistant"
                }
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            ))}

            {loading && <div className="message assistant">AI 正在分析...</div>}
          </div>

          <div className="chat-footer">
            {mode === null && (
              <div className="agent-options">
                <button onClick={selectPlatform}>了解平台使用方法</button>
                <button onClick={selectReport}>分析 GrowthOS 报告</button>
              </div>
            )}

            {mode === "report" && reportMode === null && (
              <div className="agent-options">
                <button onClick={selectOverview}>整体了解报告</button>
                <button onClick={selectDetail}>详细分析问题</button>
              </div>
            )}

            {reportMode === "detail" && (
              <div className="agent-options">
                {analysisTypes.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => sendMessage(item.prompt)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}

            <div className="chat-input">
              <input
                value={input}
                placeholder="输入你的增长问题..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage(input);
                }}
              />
              <button onClick={() => sendMessage(input)}>发送</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Agent;
