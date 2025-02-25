import React, { useState, useRef, useEffect } from "react";
import "./FeedPopup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faAngleRight,
  faCircleUser,
  faDog,
  faCaretDown,
  faPersonWalking,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { addEmergency, addFeed, pawsInformation, setOpenPopup } from "../../../redux/homeSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateLocation } from "../../../redux/userSlice";

const FeedPopup = () => {
  const [showEmergency, setShowEmergency] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const emerInputRef = useRef(null);
  const dispatch = useDispatch();
  const { dogPopData, userData } = useSelector((state) => state.home);

  const handleInputChange = () => {
    const content = emerInputRef.current?.textContent.trim() || "";
    setIsSubmitDisabled(!content);
  };

  const handleAddFeed = async () => {
    updatePosition();
    
    try {
      const feedStatus = await dispatch(
        addFeed({ gps: dogPopData.gps, dId: dogPopData.mid }),
      ).unwrap();
      let temp_details = JSON.stringify(feedStatus, null, 2);
      if (JSON.parse(temp_details).msg_type == "success") {
        dispatch(setOpenPopup(3));
      }
    } catch (error) {
      console.log(error);
      dispatch(setOpenPopup(4));
    }
  };

  const handleEmergency = async () => {
    try {
      const updateEmergency = await dispatch(
        addEmergency({
          gps: dogPopData.gps,
          dId: dogPopData.mid,
          msg: emerInputRef.current.textContent,
        }),
      ).unwrap();
      let temp_details = JSON.stringify(updateEmergency, null, 2);
      if (JSON.parse(temp_details).msg_type == "success") {
        console.log("show success");
        dispatch(setOpenPopup(3));
      }
    } catch (error) {
      console.log(error);
      dispatch(setOpenPopup(4));
    }
  };

 const updatePosition = async () => {
      try {
        const locationDetails = { latitude:dogPopData.lat,longitude:dogPopData.lon, email: userData.email };
        dispatch(updateLocation(locationDetails));
        console.log("location updated");
      } catch (error) {
        console.error("Error updating location : ", error.msg);
      }
  };


  return (
    <>
      {
        <div className="feedPopupContainer">
          <div className="feedOverlay"></div>
          <div
            className={
              showEmergency
                ? "feedPopupContent popupOverlay"
                : "feedPopupContent"
            }
          >
            <div className="feedPopupDestination">
              <div className="feedFromtoIcons">
                <div className="feedFromCircles">
                  <span className="feedFromOuter">
                    <span className="feedFromInner"></span>
                  </span>
                </div>
                <div className="feedWalkIcon">
                  <span className="feedWalkLine"></span>
                  <span className="feedWalkingCircle">
                    <FontAwesomeIcon
                      className="feedWalkingIcon"
                      icon={faPersonWalking}
                    />
                  </span>
                  <FontAwesomeIcon
                    className="feedWalkDown"
                    icon={faCaretDown}
                  />
                </div>
                <div className="feedToCircles">
                  <span className="feedToOuter">
                    <span className="feedToInner"></span>
                  </span>
                </div>
              </div>
              <div className="feedFromToInfo">
                <div className="feedFromInfo">
                  <span>
                    <FontAwesomeIcon
                      className="feedIcons"
                      icon={faCircleUser}
                    />
                  </span>
                  <span className="feedInfoText">{userData.name}</span>
                </div>
                <hr />
                <div className="feedToInfo">
                  <span>
                    <FontAwesomeIcon className="feedIcons" icon={faDog} />
                  </span>
                  <span className="feedInfoText">{dogPopData.gps}</span>
                </div>
              </div>
            </div>
            <div className="feedPopupMsg">
              <p>You reached your dog!</p>
              <div className="feedPopupBtnBox">
                {dogPopData?.isFeed == 0 && (
                  <button onClick={handleAddFeed}>
                    Feed{" "}
                    <FontAwesomeIcon
                      icon={faAngleRight}
                      className="feedBtnArrow"
                    />
                  </button>
                )}
                {dogPopData?.isEmer == 0 && (
                  <button onClick={() => {setShowEmergency(true);updatePosition()}}>
                    Emergency
                    <FontAwesomeIcon
                      icon={faAngleRight}
                      className="feedBtnArrow"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
          {!showEmergency && (
            <FontAwesomeIcon
              className="feedCloseIcon"
              icon={faXmark}
              onClick={() => {updatePosition();
                dispatch(pawsInformation())
                dispatch(setOpenPopup(0));
             }}
            />
          )}
          {showEmergency && (
            <div className="EmergencyContent">
              <div className="emergencyHeader">
                <span className="emergencyHeaderName">
                  Describe the dogs condition
                </span>
                <FontAwesomeIcon
                  className="feedCloseIconSmall"
                  icon={faXmark}
                  onClick={() => setShowEmergency(false)}
                />
                <span className="emergencySepLine"></span>
              </div>
              <div
                className="emergencyInput"
                ref={emerInputRef}
                onInput={handleInputChange}
                contentEditable="true"
              ></div>
              <div className="emergencyBtnBox">
                <button
                  className="emergencySubmitBtn"
                  onClick={handleEmergency}
                  disabled={isSubmitDisabled}
                  style={{
                    cursor: isSubmitDisabled ? "default" : "pointer",
                    opacity: isSubmitDisabled ? 0.5 : 1,
                  }}
                >
                  Submit{" "}
                  <span>
                    <FontAwesomeIcon
                      icon={faAngleRight}
                      className="feedBtnArrow"
                    />{" "}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      }
      <ToastContainer />
    </>
  );
};

export default FeedPopup;
