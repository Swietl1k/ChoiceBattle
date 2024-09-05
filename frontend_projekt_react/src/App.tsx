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

function App() {
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
