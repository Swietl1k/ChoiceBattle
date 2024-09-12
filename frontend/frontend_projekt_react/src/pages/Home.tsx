import { useState } from "react";
import Navbar from "../components/Navbar";
import CategoryList from "../components/CategoryList";
import MainContent from "../components/MainContent";

function Home() {


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
      <Navbar onSearchTerm={handleSearchTerm} />
      <CategoryList onSelectItem={handleSelectItem} />
      <MainContent
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
      />
    </>
  );
}

export default Home;
