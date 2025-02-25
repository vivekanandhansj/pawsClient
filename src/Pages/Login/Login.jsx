import React, { useState, useEffect } from "react";
import appLogo from "../../assets/paws logo.jpg";
import appTitle from "../../assets/app title font.png";
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  fetchGeoLocation,
  updateLocation,
} from "../../redux/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "axios";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, userInfo, error, location } = useSelector(
    (state) => state.user,
  );

  const [isToastActive, setIsToastActive] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    uPassword: "",
  });

  const validation = () => {
    debugger;
    if (isToastActive) return;
    setIsToastActive(true);
    if (!loginData.email.trim()) {
      toast.error("email is required!", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => setIsToastActive(false),
      });
      return false;
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(loginData.email)) {
        toast.error("Invalid email address!", {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }
    }
    if (!loginData.uPassword.trim()) {
      toast.error("Password is required!", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => setIsToastActive(false),
      });
      return false;
    } else {
      if (loginData.uPassword.length < 8 || loginData.uPassword.length > 8) {
        toast.error("Password must be 8 characters", {
          position: "top-right",
          autoClose: 3000,
          onClose: () => setIsToastActive(false),
        });
        return false;
      }
    }
    return true;
  };

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const updatePosition = async () => {
    console.log("triggered update position");
    console.log("location: ",location);
    if (location.latitude && location.longitude) {
      try {
        const locationDetails = { ...location, email: loginData.email };
        console.log(locationDetails);
        dispatch(updateLocation(locationDetails));
        console.log("location updated");
      } catch (error) {
        console.error("Error updating location : ", error.msg);
        return false;
      }
    }
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    if (validation()) {
      setIsToastActive(false);
      try {
        const user = await dispatch(loginUser(loginData)).unwrap();
        // console.log("UserData:", JSON.stringify(user, null, 2));
        let token = JSON.stringify(user, null, 2);
        token = JSON.parse(token);
        localStorage.setItem("jwt", token.jwt);
        updatePosition();
        toast.success("Volunteer signed up successfully", {
          position: "top-right",
          autoClose: 1000,
          onClose: () => {
            setIsToastActive(false);
            navigate("/home");
          },
        });
      } catch (error) {
        console.log(error);
        const message = error.msg || "An unexpected error occurred";
        toast.error(`Signup failed: ${message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };
  useEffect(() => {
    try {
      localStorage.removeItem("jwt");
      dispatch(fetchGeoLocation());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  return (
    <>
      <div className="loginContainer">
        <div className="imgContainer">
          <div className="imgData">
            <img src={appLogo} alt="" className="logo" />
          </div>
          <div className="textData">
            <img src={appTitle} alt="" className="appName" />
          </div>
        </div>
        <div className="dataContainer hide">
          <form></form>
          <div className="boxContainer">
            <div className="usernameInput">
              <input
                type="text"
                placeholder="email"
                name="email"
                onChange={handleChange}
              />
            </div>
            <div className="pwdInput">
              <input
                type="password"
                placeholder="Password"
                name="uPassword"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="loginBtnContainer">
            <button className="loginBtn" onClick={loginSubmit}>
              Login
            </button>
          </div>
        </div>
        <Link to="/signup" className="signupBtnLog">
          Sign up
        </Link>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
