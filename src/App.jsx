import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./Pages/Login/Login.jsx";
import SignUp from "./Pages/SignUp/SignUp.jsx";
import "./App.css";
import Info from "./Pages/Info/Info";
import List from "./Pages/List/List.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setWindowWidth } from "./redux/reduxSlice.jsx";
import Setting from "./Pages/Setting/Setting.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
// import FeedPopup from "./Component/Popup/FeedPopup/FeedPopup.jsx";
// import NavigatePopup from "./Component/Popup/NavigatePopup/NavigatePopup.jsx";
import Home from "./Pages/Home/Home.jsx";
import ProtectedRoute from "../ProtectedRoute.jsx";
import SuccessPopup from "./Component/Popup/SuccessPopup/SuccessPopup.jsx";
// import SuccessPopup from "./Component/Popup/SuccessPopup/SuccessPopup.jsx";

function App() {
  const dispatch = useDispatch();
  const windowWidth = useSelector((state) => state.window.width);
  console.log("initial" + windowWidth);
  const handleResize = () => {
    dispatch(setWindowWidth(window.innerWidth));
  };

  useEffect(() => {
    dispatch(setWindowWidth(window.innerWidth));

    window.addEventListener("resize", handleResize);
    console.log(windowWidth);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  useEffect(() => {}, []);

  return (
    <>
      <div className="container"></div>
      <Router>
        {/* <Login/> */}
        {/* <SignUp type={"user"}/> */}
        {/* <SignUp type={"dog"}/> */}
        {/* <List listType={"dog"} info={true}/> */}
        {/* <Header/> */}
        {/* <Footer/> */}
        {/* <List listType={"Emergency"} info={false}/> */}
        {/* <Info listType={"dog"} info={true}/> */}

        <Routes>
          <Route path="/signup" element={<SignUp type={"user"} />} />
          <Route path="/" element={<Login />} />
          {/* <Route path="/" element={<Setting listType={"Setting"} info={true}/>}/> */}
          {/* <Route path="/settingInfo" element={<Info listType={"Setting"} info={true}/>}/> */}
          {/* <Route path="/dashboard" element={<Dashboard listType={"Dashboard"} info={false}/>}/> */}
          {/* <Route path="/" element={<FeedPopup />}/> */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Routes>
                  <Route
                    path="/home"
                    element={<Home listType={"Navigation"} info={true} />}
                  />
                  <Route
                    path="/dogs"
                    element={<List listType={"dog"} info={true} />}
                  />
                  <Route path="/dog/addDog" element={<SignUp type={"dog"} />} />
                  <Route
                    path="/dog/dogInfo"
                    element={<Info listType={"dog"} info={true} />}
                  />
                  <Route
                    path="/volunteers"
                    element={<List listType={"user"} info={true} />}
                  />
                  <Route
                    path="/volunteer/volunteerInfo"
                    element={<Info listType={"user"} info={true} />}
                  />
                  <Route
                    path="/settings"
                    element={<Setting listType={"Setting"} info={true} />}
                  />
                  <Route
                    path="/settingInfo"
                    element={<Info listType={"Setting"} info={true} />}
                  />
                  <Route
                    path="/notification"
                    element={<List listType={"Notification"} info={false} />}
                  />
                  <Route
                    path="/emergency"
                    element={<List listType={"Emergency"} info={false} />}
                  />
                  <Route
                    path="/dashboard"
                    element={<Dashboard listType={"Dashboard"} info={false} />}
                  />
                  <Route
                    path="/success"
                    element={<SuccessPopup status={1} />}
                  />
                  <Route
                    path="/failure"
                    element={<SuccessPopup status={2} />}
                  />
                </Routes>
              </ProtectedRoute>
            }
          />
          {/* <Route path="/" element={<SuccessPopup status={2}/>}/> */}
          {/* <Info listType={"dog"} info={true}/> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
