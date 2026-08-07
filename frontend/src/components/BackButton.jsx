import { useNavigate } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate();

  return (
    <button className="back-button glass-card" onClick={() => navigate(-1)}>
      ←
    </button>
  );
}

export default BackButton;
