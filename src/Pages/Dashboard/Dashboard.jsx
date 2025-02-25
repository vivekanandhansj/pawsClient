import { React, useEffect } from "react";
import Header from "../../Component/Header/Header";
import Footer from "../../Component/Footer/Footer";
import "./Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faArrowUpLong,
  faCalendarDays,
  faCalendarWeek,
  faPaw,
  faPersonCane,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import DashboardDonutChart from "./DashboardDonutChart";
import DateRangePickerComponent from "../../Component/DateRangePicker/DateRangePickerComponent";
import FeedCountChart from "../../Component/DashboardChart/FeedCountChart";
import { useDispatch, useSelector } from "react-redux";
import { dashboardCounts } from "../../redux/dashboardSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MagnifyingGlass, ColorRing } from "react-loader-spinner";
import { format } from "date-fns";

const Dashboard = ({ listType, info }) => {
  const { loading, error, countData } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();

  const currentDate = new Date();
  const formattedDate = format(currentDate, "MMM d");

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${Math.floor(num / 1000)}k`;
    }
    return num.toString();
  };

  useEffect(() => {
    try {
      dispatch(dashboardCounts());
    } catch (error) {
      const message = error?.msg || "An unexpected error occurred";
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [dispatch]);

  return (
    <>
      <div className="dashboardContainer">
        <Header listType={listType} info={info} />
        {loading && !countData ? (
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
        ) : (
          <div className="dashboardContent">
            <div className="dashTotalCounts">
              <div className="dashDogCount">
                <p>
                  Dogs count{" "}
                  <span>
                    <FontAwesomeIcon className="dashCountIcon" icon={faPaw} />
                  </span>
                </p>
                <p>{formatNumber(countData.dc)}</p>
              </div>

              <div className="dashVolunteerCount">
                <p>
                  Volunteers count{" "}
                  <span>
                    <FontAwesomeIcon className="dashCountIcon" icon={faUser} />
                  </span>
                </p>
                <p>{formatNumber(countData.vc)}</p>
              </div>
            </div>
            <div className="dashDailyCounts">
              <div className="dashDailyHeader">
                <p>
                  Today<span>{formattedDate}</span>
                </p>
              </div>
              <div className="dashDailyDoughnut">
                <DashboardDonutChart countData={countData} />
                <span>
                  <FontAwesomeIcon
                    className="dashDonutIcon"
                    icon={faPersonCane}
                  />
                </span>
                <span className="dashDonutPercent">{countData.pfc}%</span>
              </div>
              <div className="dashDailyInfo">
                <p>
                  <span></span> Feed - {formatNumber(countData.fc)}
                </p>
                <p>
                  <span className="offline"></span> Not feed -{" "}
                  {formatNumber(countData.nfc)}
                </p>
              </div>
            </div>
            <div className="dashDateRangePicker">
              <DateRangePickerComponent />{" "}
              <span className="DashCalendarBox">
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  className="dashCalendarIcon"
                />
              </span>
            </div>
            <div className="dashChart">
              <FeedCountChart />
              <span className="DashCalendarBox2">
                <FontAwesomeIcon
                  icon={faCalendarWeek}
                  className="dashCalendarIcon2"
                />
              </span>
              <FontAwesomeIcon className="dashArrowUp" icon={faArrowUpLong} />
              <FontAwesomeIcon
                className="dashArrowRight"
                icon={faArrowRightLong}
              />
            </div>
          </div>
        )}
        <Footer />
      </div>
      <ToastContainer />
    </>
  );
};

export default Dashboard;
