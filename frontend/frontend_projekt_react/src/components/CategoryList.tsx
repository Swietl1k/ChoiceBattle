import { useState } from "react";
import "./CategoryList.css";
import AllPNG from "./photos/AllPNG.png";
import FoodPNG from "./photos/FoodPNG.png";
import SportPNG from "./photos/SportPNG.png";
import AnimalsPNG from "./photos/AnimalsPNG.png";
import GamingPNG from "./photos/GamingPNG.png";
import NaturePNG from "./photos/NaturePNG.png";
import MusicPNG from "./photos/MusicPNG.png";
import MoviePNG from "./photos/MoviePNG.png";
import MotorizationPNG from "./photos/motorizationPNG.png";
import { categories } from "../components/categories";
//import logo from "./Logo_2.png";

interface Props {
  onSelectItem: (item: string) => void;
}

const images: { [key: string]: string } = {
  All: AllPNG,
  Food: FoodPNG,
  Sport: SportPNG,
  Animals: AnimalsPNG,
  Gaming: GamingPNG,
  Nature: NaturePNG,
  Music: MusicPNG,
  Movies: MoviePNG,
  Motorization: MotorizationPNG,
};

function CategoryList({ onSelectItem }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <ul className="list-group custom-list-group fixed">
      {categories.map((item, index) => (
        <li
          className={
            selectedIndex === index
              ? "list-group-item list-group-item-dark active"
              : "list-group-item list-group-item-dark list-group-item-action"
          }
          key={item}
          onClick={() => {
            setSelectedIndex(index);
            onSelectItem(item);
          }}
        >
          <img
            src={images[item]}
            alt={images[item]}
            style={{ marginRight: "10px", width: "12%" }}
          ></img>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default CategoryList;
