import React from "react";
import "./NavigatePopup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faPaw,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import FeedPopup from "../FeedPopup/FeedPopup";
import { setOpenPopup } from "../../../redux/homeSlice";

const NavigatePopup = ({ calculateRoute}) => {
  const dispatch = useDispatch();
  const { dogPopData } = useSelector((state) => state.home);
  const handleNavigate = () => {
    // dispatch(setOpenPopup(2))
    if (dogPopData) {
      dispatch(setOpenPopup(0));
      calculateRoute(dogPopData);
    }
  };
  return (
    <>
      <div className="navigateContainer">
        <div className="navOverlay"></div>
        <div className="navigateContent">
          <div className="navImgBox">
            <img
              src={`data:jpg;base64,${dogPopData.img}`}
              alt=""
              className="navProfile"
            />
          </div>
          <div className="navDetails">
            <p className="navDetailsText">
              <span>
                <FontAwesomeIcon icon={faPaw} />
              </span>{" "}
              {dogPopData.gps}
            </p>
            <p className="navDetailsText">Be reason a dog has a meal today!</p>
          </div>
          <div className="navBtn">
            {dogPopData.isFeed == 0 || dogPopData.isEmer == 0 ? (
              <button onClick={handleNavigate}>
                Navigate
                <FontAwesomeIcon icon={faAngleRight} className="navBtnArrow" />
              </button>
            ) : (
              <p className="feedEmergencyText">Dog need medical emergency</p>
            )}
          </div>
          <FontAwesomeIcon
            className="navCloseIcon"
            icon={faXmark}
            onClick={() => dispatch(setOpenPopup(0))}
          />
        </div>
      </div>
    </>
  );
};

export default NavigatePopup;
