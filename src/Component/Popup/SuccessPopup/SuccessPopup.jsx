import React, { useState } from "react";
import "./SuccessPopup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { pawsInformation, setOpenPopup } from "../../../redux/homeSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const SuccessPopup = ({ status }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(true);
  return (
    <>
      <div className="overlayStatus"></div>
      {showPopup && (
        <div className="SuccessContanier">
          <div
            className={status == 1 ? "overlay" : "overlay failOverlay"}
          ></div>
          <div className="succImgContainer">
            <div className="succIcon">
              <FontAwesomeIcon
                className="succCheck"
                icon={status == 1 ? faCheck : faXmark}
              />
            </div>
            <p
              className="succText"
              style={status === 1 ? { left: "25%" } : { left: "35%" }}
            >
              {status == 1 ? "SUCCESS" : "OOPS"}
            </p>
          </div>
          <div className="succContent">
            {status == 1 ? (
              <p className="succMsg">
                You've just made a difference in a dog's life !
              </p>
            ) : (
              <p className="succMsg">Something went wrong !</p>
            )}
            <div className="succBtnBox">
              <button
                onClick={() => {
                  dispatch(setOpenPopup(0));
                  navigate("/home");
                  dispatch(pawsInformation());
                }}
                className={status == 1 ? "succBtn" : "succBtn failBtn"}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SuccessPopup;
