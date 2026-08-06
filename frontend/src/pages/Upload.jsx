import { Link } from 'react-router-dom';

function Upload() {
  return (
    <div className="page page-upload glass-panel">
      <div className="page-title">上传用户数据</div>
      <div className="upload-panel glass-card">
        <div className="upload-intro">
          <p>通过连接数据源或上传 CSV，开始增长分析流程。</p>
        </div>
        <div className="upload-actions">
          <Link to="/workspace" className="action-card glass-card">
            <h3>连接数据源</h3>
            <p>未来支持 Monad RPC 与 DApp 数据接入。</p>
          </Link>
          <Link to="/workspace" className="action-card glass-card">
            <h3>本地上传</h3>
            <p>上传包含钱包行为数据的 CSV 文件。</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Upload;
