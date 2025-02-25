import React, { useState, useEffect } from "react";
import "./Setting.css";
import Header from "../../Component/Header/Header";
import profilePic from "../../assets/user.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setting } from "../../redux/userSlice";
import { MagnifyingGlass, ColorRing } from "react-loader-spinner";
import { jwtDecode } from "jwt-decode";
const Setting = ({ listType, info }) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const token = localStorage.getItem("jwt");
  const { error, loading, userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      const id = decoded.id;
      console.log(id);
      try {
        dispatch(setting(id));
      } catch (error) {
        const message = error?.msg || "An unexpected error occurred";
        toast.error(message, {
          position: "top-right",
          autoClose: 1000,
          onClose: () => navigate("/"),
        });
      }
    }
  }, [dispatch]);
  useEffect(() => {
    if (!userInfo) return;
    const base64Data = `data:jpg;base64,${userInfo.imgData}`;
    setImagePreviewUrl(base64Data);
  }, [userInfo]);
  return (
    <>
      <div className="settingContainer">
        {!loading && userInfo ? (
          <>
            <Header listType={listType} info={info} />
            <div className="settingContent">
              <div className="settingImgContainer">
                <div className="settingProfilePic">
                  <img
                    src={imagePreviewUrl}
                    alt=""
                    className="settingProfileImg"
                  />
                </div>
                <div className="settingText">{userInfo.name}</div>
              </div>
              <div className="settingListOfDetails">
                <div className="settingList">
                  <div className="settingTextDetails">
                    <p className="settingDetailText">Volunteer settings</p>
                  </div>
                  <div className="settingIcons">
                    <Link to="/settingInfo">
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        className="settingEditIcon"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="centered-loader">
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={["#24293E"]}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Setting;
