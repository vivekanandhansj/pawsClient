import React from "react";
import "./SettingsMenu.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setIsMenuOpen } from "../../redux/menuSlice";

const SettingsMenu = ({ listType }) => {
  const navigate = useNavigate();
  const isMenuOpen = useSelector((state) => state.menu.isMenuOpen);
  console.log("menu list : " + isMenuOpen);
  const dispatch = useDispatch();
  const menuData = [
    { name: listType == "dog" ? "Add dogs" : "Dogs", id: 1 },
    { name: "Volunteers", id: 2 },
    { name: "Settings", id: 3 },
    // {name:"Select all",id:4}
  ];
  const menuClicked = (name) => {
    if (name != "Select all" && name != "Add dogs") {
      name = name.toLowerCase();
      dispatch(setIsMenuOpen(false));
      navigate(`/${name}`);
    } else if (name == "Add dogs") {
      dispatch(setIsMenuOpen(false));
      navigate("/dog/addDog");
    }
  };
  return (
    <>
      <div className="menuContainer">
        {menuData.map((menu) => {
          return (
            <div
              className="menus"
              key={menu.id}
              onClick={() => menuClicked(menu.name)}
            >
              {menu.name}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SettingsMenu;
