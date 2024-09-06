import "./Game.css";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import VersusIcon from "../components/versusIcon.png";
import { useState, useEffect } from "react";
import axios from "axios";

type gameOptions = {
  id: number;
  image: string;
  title: string;
};

function Game() {
  const location = useLocation();
  const { game } = location.state;

  const [gameData, setGameData] = useState<gameOptions[]>([]);

  const fetchAPI = async () => {
    try {
      // const response = await axios.get(
      //   `http://127.0.0.1:8080/api/games/${game.id}/play`
      // );
      const response = await axios.get(
        `http://127.0.0.1:8083/api/games/1/options`
      );
      console.log(response.data.options);
      setGameData(response.data.options);
    } catch (error) {
      console.error("Error fetching game data:", error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const handleOptionChoice = async (gameOption: gameOptions) => {
    console.log(`Option clicked: ${gameOption.id}`);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8084/api/games/option",
        {
          optionId: gameOption.id,
        }
      );

      fetchAPI();
    } catch (error) {
      console.error("Error sending option choice to backend:", error);
    }
  };

  return (
    <>
      <Navbar onSearchTerm={() => {}} />
      <div className="game-container">
        <div className="game-title">{game.title}</div>
        <div className="game-round">Rounds of 8 1/4</div>
        <div className="grid-container game-grid-container">
          <div
            className="box game-box"
            onClick={() => handleOptionChoice(gameData[0])}
          >
            <div className="game-image-box game-left-image">
              {gameData[0] && (
                <>
                  <img src={gameData[0].image} alt="" className="game-image" />
                  <h2 className="game-box-title">{gameData[0].title}</h2>
                </>
              )}
            </div>
          </div>
          <div className="box game-box">
            {" "}
            <img src={VersusIcon} alt="" className="game-versusIcon" />{" "}
          </div>
          <div
            className="box game-box"
            onClick={() => handleOptionChoice(gameData[1])}
          >
            <div className="game-image-box game-right-image">
              {gameData[1] && (
                <>
                  <img src={gameData[1].image} alt="" className="game-image" />
                  <h2 className="game-box-title">{gameData[1].title}</h2>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Game;
