import { apiUrl } from "../api/config";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import ReactMarkdown from "react-markdown";

import {
  getWallet,
} from "../blockchain/wallet";


const INITIAL_MESSAGES = [
  {
    id: "agent-welcome",
    role: "assistant",
    content:
      "你好，我是 Growth Agent。\n\n我可以帮助你了解 GrowthOS 平台，也可以基于你选择的历史分析报告提供增长洞察。",
  },
];


const MODULE_NAME_MAP = {
  growth: "用户增长分析",
  activation: "用户激活分析",
  retention: "用户留存分析",
  value: "用户价值分析",
  sybil: "风险检测分析",
};


const MODULE_ROUTE_MAP = {
  growth: "/dashboard",
  activation: "/segmentation/activation",
  retention: "/segmentation/retention",
  value: "/segmentation/value-analysis",
  sybil: "/segmentation/sybil-detection",
};


function Agent() {
  const navigate = useNavigate();

  const chatAreaRef = useRef(null);

  const [mode, setMode] = useState(null);
  const [reportMode, setReportMode] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState(
    INITIAL_MESSAGES
  );

  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportSelector, setShowReportSelector] = useState(false);


  const analysisTypes = [
    {
      name: "用户增长",
      type: "growth",
      prompt:
        "请分析当前选定 GrowthOS 报告中的用户增长问题，包括增长现状、核心原因和优化建议。",
    },
    {
      name: "用户激活",
      type: "activation",
      prompt:
        "请分析当前选定 GrowthOS 报告中的用户激活问题，包括激活表现、关键流失环节、可能原因和优化建议。",
    },
    {
      name: "用户留存",
      type: "retention",
      prompt:
        "请分析当前选定 GrowthOS 报告中的用户留存问题，包括留存表现、可能原因和优化建议。",
    },
    {
      name: "用户价值",
      type: "value",
      prompt:
        "请分析当前选定 GrowthOS 报告中的用户价值情况，识别高价值用户特征并提供运营建议。",
    },
    {
      name: "风险检测",
      type: "sybil",
      prompt:
        "请分析当前选定 GrowthOS 报告中的风险检测结果，包括异常用户和风险原因。",
    },
  ];


  // =====================================================
  // 自动滚动到最新消息
  // =====================================================

  useEffect(() => {
    const area = chatAreaRef.current;

    if (!area) {
      return;
    }

    area.scrollTop = area.scrollHeight;
  }, [messages, loading, showReportSelector]);


  // =====================================================
  // 历史报告列表
  // 后端 backend/reportdata 是真实数据源
  // =====================================================

  async function loadReports() {
    const wallet = getWallet();

    if (!wallet) {
      setReports([]);
      return [];
    }

    setReportsLoading(true);

    try {
      const response = await fetch(
        apiUrl(`/api/reports/${encodeURIComponent(
          wallet
        )}`)
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message
          || data.error
          || "历史报告读取失败"
        );
      }

      const list = Array.isArray(data.reports)
        ? data.reports
        : [];

      setReports(list);

      return list;
    }
    catch (error) {
      console.error(
        "Agent 历史报告读取失败:",
        error
      );

      setReports([]);

      return [];
    }
    finally {
      setReportsLoading(false);
    }
  }


  useEffect(() => {
    loadReports();
  }, []);


  // =====================================================
  // 消息工具
  // =====================================================

  function createMessageId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2)}`;
  }


  function updateAssistantMessage(
    messageId,
    updater
  ) {
    setMessages((current) =>
      current.map((message) => {
        if (message.id !== messageId) {
          return message;
        }

        return updater(message);
      })
    );
  }


  // =====================================================
  // 流式对话
  // =====================================================

  async function sendMessage(question) {
    const trimmedQuestion = question.trim();

    if (
      !trimmedQuestion
      || loading
    ) {
      return;
    }

    const wallet = getWallet();

    const historyForRequest = messages
      .slice(-10)
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    const userMessage = {
      id: createMessageId("user"),
      role: "user",
      content: trimmedQuestion,
    };

    const assistantMessageId =
      createMessageId("assistant");

    const currentReportId =
      selectedReport?.report_id
      || selectedReport?.reportId
      || null;

    setMessages((current) => [
      ...current,
      userMessage,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        streaming: true,
        actionModules: [],
        reportId: currentReportId,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        apiUrl("/api/agent/chat/stream"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: trimmedQuestion,
            wallet_address: wallet || null,
            report_id: currentReportId,
            messages: historyForRequest,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Agent 请求失败"
        );
      }

      if (!response.body) {
        throw new Error(
          "当前浏览器未返回可读取的流式响应"
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let buffer = "";
      let finished = false;

      while (!finished) {
        const {
          value,
          done,
        } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(
          value,
          {
            stream: true,
          }
        );

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) {
            continue;
          }

          let event;

          try {
            event = JSON.parse(line);
          }
          catch (error) {
            console.warn(
              "Agent 流式事件解析失败:",
              line
            );
            continue;
          }

          if (event.type === "chunk") {
            updateAssistantMessage(
              assistantMessageId,
              (message) => ({
                ...message,
                content:
                  message.content
                  + (event.content || ""),
              })
            );
          }

          if (event.type === "action") {
            const modules = Array.isArray(
              event.modules
            )
              ? event.modules
              : [];

            updateAssistantMessage(
              assistantMessageId,
              (message) => ({
                ...message,
                actionModules: modules,
              })
            );
          }

          if (event.type === "error") {
            updateAssistantMessage(
              assistantMessageId,
              (message) => ({
                ...message,
                content:
                  message.content
                  || event.content
                  || "AI 服务连接失败，请检查服务状态。",
              })
            );
          }

          if (event.type === "done") {
            finished = true;
            break;
          }
        }
      }

      // 如果流结束但后端没有任何文本，给出可见提示。
      updateAssistantMessage(
        assistantMessageId,
        (message) => ({
          ...message,
          streaming: false,
          content:
            message.content
            || "Agent 暂时没有生成有效回答，请稍后重试。",
        })
      );
    }
    catch (error) {
      console.error(
        "Agent 流式请求失败:",
        error
      );

      updateAssistantMessage(
        assistantMessageId,
        (message) => ({
          ...message,
          streaming: false,
          content:
            "AI 服务连接失败，请检查 FastAPI 和 Ollama 服务状态。",
        })
      );
    }
    finally {
      setLoading(false);
    }
  }


  // =====================================================
  // 平台 / 报告入口
  // =====================================================

  function selectPlatform() {
    setMode("platform");
    setReportMode(null);
    setSelectedReport(null);
    setShowReportSelector(false);

    setMessages((current) => [
      ...current,
      {
        id: createMessageId("assistant"),
        role: "assistant",
        content:
          "你想了解平台使用方法。你可以继续直接提问，例如：“怎么上传数据？”、“分析流程是什么？”、“如何查看历史报告？”",
      },
    ]);
  }


  async function selectReport() {
    setMode("report");
    setReportMode(null);
    setShowReportSelector(true);

    const list = await loadReports();

    setMessages((current) => [
      ...current,
      {
        id: createMessageId("assistant"),
        role: "assistant",
        content:
          list.length > 0
            ? "请选择一份需要分析的历史 GrowthOS 报告。后续回答只会基于你选择的这一份报告。"
            : "当前没有可分析的历史报告，请先上传数据并完成一次分析。",
      },
    ]);
  }


  function handleSelectReport(report) {
    setSelectedReport(report);
    setShowReportSelector(false);
    setReportMode(null);
    setMode("report");

    const filename =
      report.filename
      || report.file?.filename
      || "用户上传数据";

    const createdAt =
      report.created_at
      || "未知时间";

    setMessages((current) => [
      ...current,
      {
        id: createMessageId("assistant"),
        role: "assistant",
        content:
          `已选择报告：**${filename}**\n\n分析时间：${createdAt}\n\n你可以选择整体了解报告，也可以进一步分析用户增长、用户激活、用户留存、用户价值或风险检测。`,
      },
    ]);
  }


  function selectOverview() {
    if (!selectedReport) {
      setShowReportSelector(true);
      return;
    }

    setReportMode("overview");

    sendMessage(
      "请整体分析当前选定 GrowthOS 报告，总结当前增长状态、核心发现和优化方向。"
    );
  }


  function selectDetail() {
    if (!selectedReport) {
      setShowReportSelector(true);
      return;
    }

    setReportMode("detail");

    setMessages((current) => [
      ...current,
      {
        id: createMessageId("assistant"),
        role: "assistant",
        content:
          "请选择你希望分析的问题类型。",
      },
    ]);
  }


  // =====================================================
  // 对话管理
  // =====================================================

  function clearConversation() {
    if (loading) {
      return;
    }

    const retainedReport = selectedReport;

    if (retainedReport) {
      const filename =
        retainedReport.filename
        || retainedReport.file?.filename
        || "历史分析报告";

      setMessages([
        ...INITIAL_MESSAGES,
        {
          id: createMessageId("assistant"),
          role: "assistant",
          content:
            `当前对话已清空。已保留当前报告：**${filename}**。你可以继续基于这份报告提问。`,
        },
      ]);

      setMode("report");
      setReportMode(null);
      setShowReportSelector(false);
    }
    else {
      setMessages(INITIAL_MESSAGES);
      setMode(null);
      setReportMode(null);
      setShowReportSelector(false);
    }

    setInput("");
  }


  function newConversation() {
    if (loading) {
      return;
    }

    setMessages(INITIAL_MESSAGES);
    setMode(null);
    setReportMode(null);
    setInput("");
    setSelectedReport(null);
    setShowReportSelector(false);
  }


  // =====================================================
  // Analysis Center 跳转
  // =====================================================

  async function goToAnalysisModule(
    module,
    reportId
  ) {
    if (!module || !reportId) {
      return;
    }

    const route = MODULE_ROUTE_MAP[module];
    const wallet = getWallet();

    if (!route || !wallet) {
      return;
    }

    try {
      // Agent 当前选择的是历史报告。
      // 跳转前同步为平台当前分析数据，确保新版分析页面
      // 展示的仍然是同一份报告，而不是最近一次上传的数据。
      const response = await fetch(
        apiUrl(`/api/reports/${encodeURIComponent(
          wallet
        )}/${encodeURIComponent(reportId)}`)
      );

      const data = await response.json();

      if (
        !response.ok
        || !data.success
        || !data.report
      ) {
        throw new Error(
          data.message
          || data.error
          || "历史报告读取失败"
        );
      }

      const analysisResult =
        data.report.analysis
        || data.report;

      localStorage.setItem(
        "analysis_result",
        JSON.stringify(analysisResult)
      );

      navigate(route);
    }
    catch (error) {
      console.error(
        "Agent 跳转分析模块失败:",
        error
      );

      alert(
        error.message
        || "无法打开对应分析模块"
      );
    }
  }


  return (
    <div className="agent-page">
      <div className="agent-shell">
        <div className="agent-chat-frame">
          <div
            className="chat-area"
            ref={chatAreaRef}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "message user"
                    : "message assistant"
                }
              >
                {
                  message.streaming
                  && !message.content
                  ? (
                    <span className="agent-streaming-placeholder">
                      AI 正在分析...
                    </span>
                  )
                  : (
                    <ReactMarkdown>
                      {message.content}
                    </ReactMarkdown>
                  )
                }

                {
                  message.role === "assistant"
                  && message.reportId
                  && Array.isArray(message.actionModules)
                  && message.actionModules.length > 0
                  && (
                    <div className="agent-message-actions">
                      {message.actionModules.map((module) => (
                        <button
                          key={module}
                          onClick={() =>
                            goToAnalysisModule(
                              module,
                              message.reportId
                            )
                          }
                        >
                          进入{
                            MODULE_NAME_MAP[module]
                            || "分析中心"
                          }
                          {" →"}
                        </button>
                      ))}
                    </div>
                  )
                }
              </div>
            ))}
          </div>


          <div className="chat-footer">
            <div className="agent-chat-toolbar">
              <button
                onClick={newConversation}
                disabled={loading}
              >
                ＋ 新对话
              </button>

              <button
                onClick={clearConversation}
                disabled={loading}
              >
                清空对话
              </button>
            </div>


            {selectedReport && (
              <div className="agent-current-report">
                <span>
                  当前报告：{
                    selectedReport.filename
                    || selectedReport.file?.filename
                    || "历史分析报告"
                  }
                </span>

                <button
                  onClick={async () => {
                    await loadReports();
                    setMode("report");
                    setReportMode(null);
                    setShowReportSelector(true);
                  }}
                  disabled={loading}
                >
                  切换报告
                </button>
              </div>
            )}


            {showReportSelector && (
              <div className="agent-report-selector">
                <div className="agent-report-selector-title">
                  选择历史分析报告
                </div>

                {reportsLoading ? (
                  <div className="agent-report-empty">
                    正在读取历史报告...
                  </div>
                ) : reports.length === 0 ? (
                  <div className="agent-report-empty">
                    暂无历史分析报告，请先上传数据并完成分析。
                  </div>
                ) : (
                  reports.map((report, index) => {
                    const reportId =
                      report.report_id
                      || report.reportId
                      || index;

                    return (
                      <button
                        key={reportId}
                        className="agent-report-option"
                        onClick={() =>
                          handleSelectReport(report)
                        }
                        disabled={loading}
                      >
                        <strong>
                          {
                            report.filename
                            || report.file?.filename
                            || `分析报告 ${reports.length - index}`
                          }
                        </strong>

                        <span>
                          {
                            report.created_at
                            || "未知时间"
                          }
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            )}


            {mode === null && (
              <div className="agent-options">
                <button
                  onClick={selectPlatform}
                  disabled={loading}
                >
                  了解平台使用方法
                </button>

                <button
                  onClick={selectReport}
                  disabled={loading}
                >
                  分析 GrowthOS 报告
                </button>
              </div>
            )}


            {
              mode === "report"
              && selectedReport
              && reportMode === null
              && !showReportSelector
              && (
                <div className="agent-options">
                  <button
                    onClick={selectOverview}
                    disabled={loading}
                  >
                    整体了解报告
                  </button>

                  <button
                    onClick={selectDetail}
                    disabled={loading}
                  >
                    详细分析问题
                  </button>
                </div>
              )
            }


            {
              reportMode === "detail"
              && selectedReport
              && (
                <div className="agent-options">
                  {analysisTypes.map((item) => (
                    <button
                      key={item.type}
                      onClick={() =>
                        sendMessage(item.prompt)
                      }
                      disabled={loading}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )
            }


            <div className="chat-input">
              <input
                value={input}
                placeholder="输入你的增长问题..."
                disabled={loading}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter"
                    && !event.nativeEvent.isComposing
                  ) {
                    sendMessage(input);
                  }
                }}
              />

              <button
                onClick={() =>
                  sendMessage(input)
                }
                disabled={loading}
              >
                {loading ? "生成中" : "发送"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Agent;
