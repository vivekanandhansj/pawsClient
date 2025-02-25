import React from "react";
import "./Footer.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDashboard,
  faKitMedical,
  faLocationArrow,
  faBell,
  faChartPie,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
const FooterDetails = [
  { name: "Navigation", iconName: faLocationArrow, id: 0 },
  { name: "Emergency", iconName: faKitMedical, id: 1 },
  { name: "Dashboard", iconName: faChartPie, id: 2 },
  { name: "Notification", iconName: faBell, id: 3 },
];
const Footer = ({ listType }) => {
  const windowWidth = useSelector((state) => state.window.width); // Access the windowWidth from Redux state
  const location = useLocation();
  return (
    <>
      <div className="footerContainer">
        {FooterDetails.map((menu) => {
          const isActive =
            location.pathname.includes(menu.name.toLowerCase()) ||
            (menu.name === "Navigation" && location.pathname === "/home");

          return (
            <div className="footerMenuList" key={menu.id}>
              <div>
                <Link
                  to={`/${menu.name.toLowerCase() === "navigation" ? "home" : menu.name.toLowerCase()}`}
                  className={
                    isActive ? "footerMenuIcon footerActive" : "footerMenuIcon"
                  }
                >
                  <FontAwesomeIcon
                    data-tooltip-id={`${menu.name}` + "-tooltip"}
                    icon={menu.iconName}
                    className={
                      isActive ? "footerMenus footerIconActive" : "footerMenus"
                    }
                  />
                  {windowWidth >= 1024 && (
                    <span className="footerNavbarMenu">{menu.name}</span>
                  )}
                </Link>
              </div>
              <div className="footerMenuName">{menu.name}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Footer;
