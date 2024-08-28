import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import GameDetails from "./pages/GameDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Renderowanie strony głównej */}
        <Route path="/" element={<Home />} />

        {/* Renderowanie strony logowania */}
        <Route path="/login" element={<Login />} />

        <Route path="/sign-up" element={<SignUp />} />

        <Route path="/:category/:id" element={<GameDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
