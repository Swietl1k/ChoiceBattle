import { useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import CategoryList from "../components/CategoryList";
import MainContent from "../components/MainContent";

function Home() {
  const location = useLocation();

  //Bedzie jakos username, a nie mail
  const email = location.state?.email || "";

  const categories = ["All", "Food", "Sport", "Animals", "Gaming", "Nature"];
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectItem = (item: string) => {
    setSelectedCategory(item);
  };

  const handleSearchTerm = (item: string) => {
    setSearchTerm(item);
  };

  return (
    <>
      <Navbar username={email} onSearchTerm={handleSearchTerm} />
      <CategoryList items={categories} onSelectItem={handleSelectItem} />
      <MainContent
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
      />
    </>
  );
}

export default Home;
