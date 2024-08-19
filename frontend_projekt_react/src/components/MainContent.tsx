import "./MainContent.css";
import axios from "axios";
import { useState, useEffect } from "react";

type Game = {
  title: string;
  description: string;
  category: string;
  image: string;
};

interface Props {
  selectedCategory: string;
}

function MainContent({ selectedCategory }: Props) {
  const [games, setGames] = useState<Game[]>([]);

  const fetchAPI = async () => {
    const response = await axios.get("http://127.0.0.1:8080/api/games");
    setGames(response.data.games);
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const filteredGames = games.filter((game) =>
    selectedCategory === "All" ? true : game.category === selectedCategory
  );

  return (
    <div className="main-content-container">
      <div className="row row-cols-2 row-cols-md-3 g-4">
        {filteredGames.map((game, index) => (
          <div className="col" key={index}>
            <div className="card h" style={{ width: "300px", height: "340px" }}>
              <img src={game.image} className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">{game.title}</h5>
                <p className="card-text">{game.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainContent;
