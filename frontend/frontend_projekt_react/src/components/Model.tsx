import "./Model.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface Props {
  winnerImg: string | null;
  winnerTitle: string | null;
}

function Model({ winnerImg, winnerTitle }: Props) {
  const location = useLocation();
  const { game } = location.state;

  const navigate = useNavigate();

  const handleClik = () => {
    navigate(`/${game.category}/${game.id}`, {
      state: { game },
    });
  };

  return (
    <div className="model_background" onClick={handleClik}>
      <div className="model_container" onClick={(e) => e.stopPropagation()}>
        <div className="model_header">
          <div className="model_close_btn" onClick={handleClik}>
            X
          </div>
          <div className="model_spacer"></div>
          <div className="model_title">The winner is: {winnerTitle}</div>
        </div>
        <div className="model_content">
          <div className="model_winner">
            {winnerImg && (
              <img
                src={winnerImg}
                alt="WinnerImage"
                className="model_winner_img"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Model;

