import { useRef, useState } from "react";
import * as XLSX from "xlsx";

function Upload() {
  const fileInputRef = useRef(null);

  const [uploadStatus, setUploadStatus] = useState("idle");

  const [progress, setProgress] = useState(0);

  // ==========================
  // 点击本地上传
  // ==========================

  function handleUploadClick() {
    fileInputRef.current.click();
  }

  // ==========================
  // 文件读取
  // ==========================

  function handleFileChange(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setUploadStatus("reading");

    setProgress(0);

    const reader = new FileReader();

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const value = Math.round((e.loaded / e.total) * 100);

        setProgress(value);
      }
    };

    reader.onload = () => {
      try {
        let rows = [];

        // ======================
        // CSV
        // ======================

        if (file.name.endsWith(".csv")) {
          const text = reader.result;

          const lines = text.split("\n").filter((item) => item.trim() !== "");

          const headers = lines[0].split(",");

          rows = lines.slice(1).map((line) => {
            const values = line.split(",");

            let obj = {};

            headers.forEach((key, index) => {
              obj[key.trim()] = values[index];
            });

            return obj;
          });
        }

        // ======================
        // XLSX
        // ======================
        else if (file.name.endsWith(".xlsx")) {
          const workbook = XLSX.read(reader.result, {
            type: "array",
          });

          const sheet = workbook.Sheets[workbook.SheetNames[0]];

          rows = XLSX.utils.sheet_to_json(sheet);
        }

        // ======================
        // 数据校验
        // ======================

        if (rows.length === 0) {
          throw new Error("empty data");
        }

        const columns = Object.keys(rows[0]).map((item) => item.toLowerCase());

        const hasWallet = columns.some(
          (item) => item.includes("wallet") || item.includes("address"),
        );

        if (!hasWallet) {
          throw new Error("missing wallet field");
        }

        // ======================
        // 暂存上传结果
        // ======================

        const uploadInfo = {
          fileName: file.name,

          rows: rows.length,

          columns: Object.keys(rows[0]),

          status: "success",

          uploadTime: new Date().toISOString(),
        };

        sessionStorage.setItem("uploadData", JSON.stringify(uploadInfo));

        setProgress(100);

        setTimeout(() => {
          setUploadStatus("success");
        }, 500);
      } catch (error) {
        console.log(error);

        setUploadStatus("failed");
      }
    };

    reader.onerror = () => {
      setUploadStatus("failed");
    };

    reader.readAsText(file);
  }

  // ==========================
  // 成功后确认
  // ==========================

  function confirmAnalysis() {
    alert("等待接入钱包签名与链上交易");

    /*
      后续替换：

      wallet.signTransaction()

      ↓

      Monad Contract

      ↓

      transaction hash

    */
  }

  return (
    <div className="page page-upload">
      <div className="page-title">上传用户数据</div>

      <div className="upload-actions">
        {/* 数据源 */}

        <div className="action-card glass-card">
          <h3>连接数据源</h3>

          <p>未来支持 Monad RPC 与 DApp 数据接入。</p>
        </div>

        {/* 本地上传 */}

        <div
          className="action-card glass-card upload-card"
          onClick={uploadStatus === "idle" ? handleUploadClick : undefined}
        >
          {uploadStatus === "idle" && (
            <>
              <h3>本地上传</h3>

              <p>上传包含钱包行为数据的 CSV / XLSX 文件。</p>
            </>
          )}

          {uploadStatus === "reading" && (
            <>
              <h3>读取数据中</h3>

              <div className="upload-progress">
                <div
                  className="upload-progress-bar"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </>
          )}

          {uploadStatus === "success" && (
            <>
              <h3 className="success-text">数据读取成功</h3>

              <button
                className="upload-confirm-btn"
                onClick={(e) => {
                  e.stopPropagation();

                  confirmAnalysis();
                }}
              >
                确认分析并上链
              </button>
            </>
          )}

          {uploadStatus === "failed" && (
            <>
              <h3 className="failed-text">数据读取失败</h3>

              <button
                className="upload-confirm-btn"
                onClick={() => {
                  setUploadStatus("idle");
                }}
              >
                重新上传
              </button>
            </>
          )}
        </div>
      </div>

      <p className="upload-tip">通过连接数据源或上传 CSV，开始增长分析流程。</p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx"
        hidden
        onChange={handleFileChange}
      />
    </div>
  );
}

export default Upload;
