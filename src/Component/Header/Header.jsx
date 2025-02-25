import React, { useState, useEffect, useRef } from "react";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faArrowLeft,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip as ReactTooltip } from "react-tooltip";
import SettingsMenu from "../SettingsMenu/SettingsMenu";
import { useDispatch, useSelector } from "react-redux";
import { setIsMenuOpen, toggleMenu } from "../../redux/menuSlice";
import { useNavigate, useLocation } from "react-router-dom";

const headerDetails = [
  { name: "Settings", iconName: faEllipsisVertical, id: 0 },
  { name: "Go back", iconName: faArrowLeft, id: 1 },
  { name: "Logout", iconName: faRightFromBracket, id: 2 },
];

const Header = ({ listType, info }) => {
  const navigate = useNavigate();
  const pathLocation = useLocation();
  const [headerName, setHeaderName] = useState("");

  const dispatch = useDispatch();
  const isMenuOpen = useSelector((state) => state.menu.isMenuOpen);

  // Update the header name based on listType and info props
  useEffect(() => {
    if (info) {
      setHeaderName(
        listType === "user"
          ? "Volunteers"
          : listType === "dog"
            ? "Dogs"
            : listType,
      );
    } else {
      setHeaderName(listType);
    }
  }, [listType, info]);

  // Toggle menu open/close
  const handleMenuToggle = () => {
    dispatch(toggleMenu());
  };

  // Close the menu when clicking outside
  useEffect(() => {
    const handleBodyClick = (event) => {
      if (!event.target.classList.contains("menus")) {
        dispatch(setIsMenuOpen(false));
      }
    };

    document.addEventListener("mousedown", handleBodyClick);
    return () => {
      document.removeEventListener("mousedown", handleBodyClick);
    };
  }, [dispatch]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/");
  };

  // Go back to the previous page
  const handleGoBack = () => {
    const currentPath = pathLocation.pathname;
    if (window.history.length > 1) {
      debugger;
      if (currentPath == "/volunteers" || currentPath == "/dogs") {
        return navigate("/home");
      }
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="headerContainer">
      {/* Header details */}
      <div className="headerDetails">
        <span className="headerBackContainer">
          {info && listType !== "Navigation" && (
            <FontAwesomeIcon
              data-tooltip-id="headerBackIcon-tooltip"
              icon={headerDetails[1].iconName}
              className="headerBackIcon"
              onClick={handleGoBack}
            />
          )}
          <ReactTooltip
            id="headerBackIcon-tooltip"
            className="tooltip"
            place="bottom"
            content="Go back"
          />
        </span>

        <span className="headerName">{headerName}</span>
      </div>

      {/* Header settings menu */}
      {info && (
        <div className="headerSettingsMenu">
          {listType === "Setting" ? (
            <>
              <FontAwesomeIcon
                data-tooltip-id="Logout-tooltip"
                icon={headerDetails[2].iconName}
                className="logout"
                onClick={handleLogout}
              />
              <ReactTooltip
                id="Logout-tooltip"
                className="tooltip"
                place="left"
                content="Logout"
              />
            </>
          ) : (
            <>
              <span onClick={handleMenuToggle}>
                <FontAwesomeIcon
                  data-tooltip-id="Settings-tooltip"
                  icon={headerDetails[0].iconName}
                  className="headerThreeDot"
                />
              </span>
              <ReactTooltip
                id="Settings-tooltip"
                className="tooltip"
                place="left"
                content="Settings"
              />
            </>
          )}

          {isMenuOpen && <SettingsMenu listType={listType} />}
        </div>
      )}
    </div>
  );
};

export default Header;
