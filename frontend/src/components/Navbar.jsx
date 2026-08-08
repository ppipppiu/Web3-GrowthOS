import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar glass-panel">
      <div
        className="navbar-logo"
        onClick={() => navigate("/workspace")}
      >
        Monad Growth Intelligence · Monad 增长智能分析平台
      </div>

      <div className="navbar-links">

        <div
          className="navbar-item"
          onClick={() => navigate("/upload")}
        >
          上传
        </div>

        <div
          className="navbar-item"
          onClick={() => navigate("/agent")}
        >
          Agent
        </div>

        <div
          className="navbar-item"
          onClick={() => navigate("/reports")}
        >
          报告
        </div>

      </div>
    </nav>
  );
}

export default Navbar;