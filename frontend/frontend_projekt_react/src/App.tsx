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
      const response = await axios.get('https://127.0.0.1:8000/strona/get_new_id_token/' ,{
        withCredentials: true, 
      });

      if (response.data.success) {
        let expiresIn = response.data.expires_in;

        
        expiresIn = Number(expiresIn); 
        const expiresAt = Date.now() + expiresIn * 1000; 
        
        localStorage.setItem('id_token', response.data.id_token);
        localStorage.setItem('expires_at', expiresAt.toString());
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
      const userName = localStorage.getItem('user_name'); 

    if (!userName) {
      console.log("User not logged in, skipping token checks.");
      return;
    }


      const idToken = localStorage.getItem('id_token');
      const expiresAt = localStorage.getItem('expires_at');

      if (!idToken || !expiresAt) {
        console.log("No token found, refreshing immediately.");
        refreshAccessToken(); 
        return;
      }

      const expiresAtNumber = Number(expiresAt); 
      const currentTime = Date.now();

      console.log("Expires at:", new Date(expiresAtNumber).toLocaleTimeString());
      console.log("Current time:", new Date(currentTime).toLocaleTimeString());

      const fiveMinutesBeforeExpiration = expiresAtNumber - 5 * 60 * 1000;


      if (currentTime >= expiresAtNumber) {
        console.log("Token has expired. Refreshing the token...");
        refreshAccessToken();
      } else if(currentTime >= fiveMinutesBeforeExpiration) {
        console.log("Token will expire in less than 5 minutes. Refreshing the token...");
        refreshAccessToken();
      } else {
        console.log("Token is still valid.");
      }
    };
  
    checkTokenExpiration(); // Check immediately when the app starts

    const interval = setInterval(() => {
      checkTokenExpiration();
      
    }, 3 * 60 * 1000); 
  
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
