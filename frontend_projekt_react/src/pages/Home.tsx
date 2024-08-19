import Navbar from "../components/Navbar";
import CategoryList from "../components/CategoryList";

function Home() {
  const navbar = ["Home", "Highlights", "Create"];
  const categories = ["All", "Food", "Sport", "Animals", "Gaming", "Nature"];
  
  const handleSelectItem = (item: string) => {
    console.log(item);
  };

  return (
    <>
      <Navbar items={navbar} />
      <CategoryList items={categories} onSelectItem={handleSelectItem} />
    </>
  );
}

export default Home;