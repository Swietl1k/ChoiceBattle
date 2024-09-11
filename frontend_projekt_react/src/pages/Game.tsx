import "./Game.css";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import VersusIcon from "../components/versusIcon.png";
import { useState, useEffect } from "react";
import axios from "axios";

type gameOptions = {
  img1_url: string;
  img2_url: string;
  img1_title: string;
  img2_title: string;
  current_round: number;
  number_of_choices: number;
};

function Game() {
  const location = useLocation();
  const { game } = location.state;

  const [gameData, setGameData] = useState<gameOptions | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAPI = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://127.0.0.1:8000/strona/play_end_get/${game.id}/`, 
        {
          withCredentials: true
        }
      );
      setGameData(response.data);
      console.log(gameData);
    } catch (error) {
      console.error("Error fetching game data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const handleOptionChoice = async (winner: String) => {
    setLoading(true);
    try {
      await axios.post(
        `https://127.0.0.1:8000/strona/play_end_post/${game.id}/`,
        {
          winner: winner,
        },
        {
          withCredentials: true
        }
      );

      fetchAPI();
    } catch (error) {
      console.error("Error sending option choice to backend:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar onSearchTerm={() => {}} />
      <div className="game-container">
        <div className="game-title">{game.title}</div>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div className="game-round">{gameData?.current_round} / {gameData?.number_of_choices}</div>
            <div className="grid-container game-grid-container">
              <div
                className="box game-box"
                onClick={() => handleOptionChoice("img1")}
              >
                <div className="game-image-box game-left-image">
                  {gameData && (
                    <>
                      <img
                        src={gameData.img1_url}
                        alt=""
                        className="game-image"
                      />
                      <h2 className="game-box-title">{gameData.img1_title}</h2>
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
                onClick={() => handleOptionChoice("img2")}
              >
                <div className="game-image-box game-right-image">
                  {gameData && (
                    <>
                      <img
                        src={gameData.img2_url}
                        alt=""
                        className="game-image"
                      />
                      <h2 className="game-box-title">{gameData.img2_title}</h2>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Game;
