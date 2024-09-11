import "./GameDetails.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
 
type GameDetails = {
  id: number;
  title: string;
  championship_rate: number;
  win_rate: number;
  image_url: string;
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
  
  const idToken = localStorage.getItem('id_token') || sessionStorage.getItem('id_token');
  const storedUsername = localStorage.getItem('user_name');

  const location = useLocation();
  const { game } = location.state;
 
  const fetchAPI = async () => {
    try {
      const responseDetails = await axios.get(`https://127.0.0.1:8000/strona/get_game_by_id/${game.id}/`);
      setPretendents(responseDetails.data.choice_data);
    } catch (error) {
      console.error("Error fetching game details:", error);
    }
 
    try {
      const responseComments = await axios.get(
        `https://127.0.0.1:8000/strona/get_game_comments/${game.id}/`
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
 
  
  const handleAddComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
 
    if (newComment.trim() === "") return;
 
    const newCommentData = {
      id: comments.length + 1,
      username: storedUsername || "Anonimowy użytkownik",
      body: newComment,
    };
    
    console.log(idToken);

    try {
      setComments((prevComments) => [...prevComments, newCommentData]);
      setNewComment("");
      
      await axios.post(`https://127.0.0.1:8000/strona/add_comment/${game.id}/`,
        {
          comment: newCommentData.body
        }, {
          headers: {Authorization: `Bearer ${idToken}`}
        }
      );

    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };




  const handlePlayClick = async () => {
    navigate(`/${game.category}/${game.id}/play`, {
      state: { game },
    });

    try{
      await axios.get(
        `https://127.0.0.1:8000/strona/start_game/${game.id}/`, {withCredentials: true});
    } catch(error) {
      console.log("Error POST play button: ", error);
    }
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
              <img className="pretendent-image" src={pretendent.image_url} alt="" />
 
              <div className="pretendent-progress">
                <span>Championship Rate</span>
 
                <div className="progress">
                  <div
                    className="progress-bar champion-progress"
                    role="progressbar"
                    style={{ width: `${pretendent.championship_rate}%` }}
                    aria-valuenow={pretendent.championship_rate}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    {pretendent.championship_rate}%
                  </div>
                </div>
 
                <span>Win Rate</span>
 
                <div className="progress">
                  <div
                    className="progress-bar win-progress"
                    role="progressbar"
                    style={{ width: `${pretendent.win_rate}%` }}
                    aria-valuenow={pretendent.win_rate}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    {pretendent.win_rate}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
 
        <div className="box gameDetails-box right-box">
          <div className="comment-section">
          {storedUsername && (
              <form
                action=""
                className="comment-box"
                onSubmit={handleAddComment}
              >
                <div className="comment-username">{storedUsername}</div>
                <textarea
                  name="comment"
                  className="comment-textarea"
                  placeholder="Comment..."
                  value={newComment}
                  onChange={handleInputChange}
                ></textarea>
                <button className="commnet-button">Comment</button>
              </form>
            )}
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
 
