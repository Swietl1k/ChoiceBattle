//import { useState, useEffect } from "react";
//import reactLogo from "./assets/react.svg";
//import viteLogo from "/vite.svg";
import "./App.css";
//import axios from "axios";
import CategoryList from "./components/CategoryList";
import Navbar from "./components/Navbar";
// In App.tsx or index.tsx
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  // const [count, setCount] = useState(0);
  // const [array, setArray] = useState([]);

  // const fetchAPI = async () => {
  //   const response = await axios.get("http://127.0.0.1:8080/api/users");
  //   //console.log(response.data.users);
  //   setArray(response.data.users);
  // };

  // useEffect(() => {
  //   fetchAPI();
  // }, []);

  const navbar = ["Home", "Highlights", "Create"];
  const categories = ["All", "Food", "Sport", "Animals", "Gaming", "Nature"];
  const handleSelectItem = (item: string) => {
    console.log(item);
  };

  return (
    <>
      <Navbar items={navbar}></Navbar>
      <CategoryList items={categories} onSelectItem={handleSelectItem} />
    </>
  );
}

export default App;
