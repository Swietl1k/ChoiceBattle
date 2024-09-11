import "./Model.css";
 
function Model() {
  return (
    <div className="model_backround">
      <div className="model_container">
        <div className="model_header">
          <div className="model_close_btn">X</div>
          <div className="model_title">The winner is:</div>
        </div>
        <div className="model_content">
          <div className="model_winner_img"></div>
          <div className="model_winner_title"></div>
        </div>
      </div>
    </div>
  );
}
export default Model;