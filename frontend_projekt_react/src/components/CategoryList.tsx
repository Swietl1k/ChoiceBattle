import { useState } from "react";
import "./CategoryList.css";
import AllPNG from "./photos/AllPNG.png";
import FoodPNG from "./photos/FoodPNG.png";
import SportPNG from "./photos/SportPNG.png";
import AnimalsPNG from "./photos/AnimalsPNG.png";
import GamingPNG from "./photos/GamingPNG.png";
import NaturePNG from "./photos/NaturePNG.png";
//import logo from "./Logo_2.png";

interface Props {
  items: string[];
  onSelectItem: (item: string) => void;
}

const images: { [key: string]: string } = {
  All: AllPNG,
  Food: FoodPNG,
  Sport: SportPNG,
  Animals: AnimalsPNG,
  Gaming: GamingPNG,
  Nature: NaturePNG,
};

function CategoryList({ items, onSelectItem }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <ul className="list-group custom-list-group fixed">
      {items.map((item, index) => (
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
            style={{ marginRight: "10px", width: "55px" }}
          ></img>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default CategoryList;
