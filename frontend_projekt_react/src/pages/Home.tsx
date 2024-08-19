import { useState } from "react";
import Navbar from "../components/Navbar";
import CategoryList from "../components/CategoryList";
import MainContent from "../components/MainContent";

function Home() {
  const navbar = ["Home", "Highlights", "Create"];
  const categories = ["All", "Food", "Sport", "Animals", "Gaming", "Nature"];
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const handleSelectItem = (item: string) => {
    setSelectedCategory(item);
  };

  return (
    <>
      <Navbar items={navbar} />
      <CategoryList items={categories} onSelectItem={handleSelectItem} />
      <MainContent selectedCategory={selectedCategory} />
    </>
  );
}

export default Home;
