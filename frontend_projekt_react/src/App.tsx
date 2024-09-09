import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import GameDetails from "./pages/GameDetails";
import Create from "./pages/CreateFirstPage";
import CreateSecondPage from "./pages/CreateSecondPage";
import Game from "./pages/Game";
import axios from "axios";
import { useEffect } from "react";

function App() {

  const refreshAccessToken = async () => {
    console.log("Refreshing token...");
    try {
      const response = await axios.get('http://127.0.0.1:8000/get_new_id_token/' ,{
        withCredentials: true, 
      });

      if (response.data.success) {
        alert(response.data.message);

        localStorage.setItem('id_token', response.data.id_token);
        localStorage.setItem('expires_in', response.data.expires_in); 
        console.log("Token refreshed successfully.");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error requesting token refresh:", error);
    }
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      const expiresIn = localStorage.getItem('expires_in');
      if (!expiresIn) return;
  
      const expiresInNumber = +expiresIn; 
      const expiresAt = Date.now() + expiresInNumber * 1000; 
      const fiveMinutesBeforeExpiration = expiresAt - 5 * 60 * 1000; 
      const currentTime = Date.now();
  
      if (currentTime >= fiveMinutesBeforeExpiration) {
        refreshAccessToken();
      }
    };
  
    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000); 
  
    return () => clearInterval(interval); 
  }, []); 
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/sign-up" element={<SignUp />} />

        <Route path="/:category/:id" element={<GameDetails />} />

        <Route path="/:category/:id/play" element={<Game />} />

        <Route path="/create-one" element={<Create />} />

        <Route path="/create-two" element={<CreateSecondPage />} />

        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
