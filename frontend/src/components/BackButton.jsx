import { useNavigate, useLocation } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  const location = useLocation();

  function handleBack() {
    const history = window.history;

    // 当前没有上一页
    if (history.length <= 1) {
      navigate("/workspace");

      return;
    }

    // 如果上一页是首页
    if (
      document.referrer.includes(window.location.origin) &&
      location.pathname !== "/"
    ) {
      const previousPath = sessionStorage.getItem("previousPath");

      if (previousPath === "/") {
        navigate("/workspace", {
          replace: true,
        });

        return;
      }
    }

    navigate(-1);
  }

  return (
    <button className="back-button" onClick={handleBack}>
      ←
    </button>
  );
}

export default BackButton;
