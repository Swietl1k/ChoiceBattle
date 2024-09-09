import "./GameDetails.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
 
type GameDetails = {
  id: number;
  title: string;
  championshipRate: number;
  winRate: number;
  image: string;
};
 
type Comments = {
  id: number;
  username: string;
  body: string;
};
 
function GameDetails() {
  const [pretendents, setPretendents] = useState<GameDetails[]>([]);
  const [comments, setComments] = useState<Comments[]>([]);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();
 
  const location = useLocation();
  const { game } = location.state;
 
  const fetchAPI = async () => {
    try {
      const responseDetails = await axios.get(`http://127.0.0.1:8000/strona/get_game_by_id/${game.id}`);
      setPretendents(responseDetails.data.choice_data);
    } catch (error) {
      console.error("Error fetching game details:", error);
    }
 
    try {
      const responseComments = await axios.get(
        `http://127.0.0.1:8000/strona/get_game_comments/${game.id}`
      );
      const transformedComments = Object.keys(responseComments.data).map(
        (key, index) => ({
          id: index + 1,
          body: responseComments.data[key].comment,
          username: responseComments.data[key].user_name,
        })
      );
 
      setComments(transformedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
 
  useEffect(() => {
    fetchAPI();
  }, []);
 
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(event.target.value);
  };
 
  const handleAddComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
 
    if (newComment.trim() === "") return;
 
    const newCommentData = {
      id: comments.length + 1,
      username: "zalogowany uzytkownik",
      body: newComment,
    };
 
    setComments((prevComments) => [...prevComments, newCommentData]);
    setNewComment("");
  };
 
  const handlePlayClick = () => {
    navigate(`/${game.category}/${game.id}/play`, {
      state: { game },
    });
  };
 
  return (
    <>
      <Navbar onSearchTerm={() => {}} />
      <div className="grid-container gameDetails-grid-container">
        <div className="box gameDetails-box left-box">
          <img className="details-img" src={game.image} alt="" />
          <h1 className="details-title">{game.title}</h1>
          <span className="details-description">{game.description}</span>
          <h3 className="details-creator">{game.creator}</h3>
          <button className="details-button" onClick={handlePlayClick}>
            {" "}
            <span className="details-span-play">Play</span>
          </button>
        </div>
        <div className="box gameDetails-box middle-box">
          {pretendents.map((pretendent, index) => (
            <div className="pretendent" key={index}>
              <h5 className="pretendent-title">
                {index + 1}. {pretendent.title}
              </h5>
              <img className="pretendent-image" src={pretendent.image} alt="" />
 
              <div className="pretendent-progress">
                <span>Championship Rate</span>
 
                <div className="progress">
                  <div
                    className="progress-bar champion-progress"
                    role="progressbar"
                    style={{ width: `${pretendent.championshipRate}%` }}
                    aria-valuenow={pretendent.championshipRate}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    {pretendent.championshipRate}%
                  </div>
                </div>
 
                <span>Win Rate</span>
 
                <div className="progress">
                  <div
                    className="progress-bar win-progress"
                    role="progressbar"
                    style={{ width: `${pretendent.winRate}%` }}
                    aria-valuenow={pretendent.winRate}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    {pretendent.winRate}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
 
        <div className="box gameDetails-box right-box">
          <div className="comment-section">
            <form action="" className="comment-box" onSubmit={handleAddComment}>
              <div className="comment-username">zalogowany uzytkownik</div>
              <textarea
                name="comment"
                className="comment-textarea"
                placeholder="Comment..."
                value={newComment}
                onChange={handleInputChange}
              ></textarea>
              <button className="commnet-button">Comment</button>
            </form>
            <div className="post-comment">
              {comments.map((comment, index) => (
                <div className="comment-list" key={index}>
                  <div className="comment-username">{comment.username}</div>
                  <div className="comment-body">{comment.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
 
export default GameDetails;
 
