import React, { useEffect, useState } from "react";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faClose } from "@fortawesome/free-solid-svg-icons";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Footer from "../../Component/Footer/Footer";
import Header from "../../Component/Header/Header";
import MapComponent from "../../Component/MapComponent/MapComponent";
import { useDispatch, useSelector } from "react-redux";
import { pawsInformation } from "../../redux/homeSlice";
import { ColorRing } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";

const dogListData = [
  { id: 1, name: "Search", iconName: faSearch },
  { id: 2, name: "Close", iconName: faClose },
];

const Home = ({ listType, info }) => {
  const dispatch = useDispatch();
  const { loading, error, pawsData } = useSelector((state) => state.home);

  const [searchTerm, setSearchTerm] = useState("");
  const [isToastActive, setIsToastActive] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);
  const [zoom, setZoom] = useState(8);

  useEffect(() => {
    try {
      dispatch(pawsInformation());
      console.log("pawsData",pawsData);
    } catch (error) {}
  }, [dispatch]);

  // useEffect(() => {
  //   try {
  //     console.log(pawsData.user);
  //   } catch (error) {}
  // }, [pawsData]);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    if (isToastActive) return;
    setIsToastActive(true);
    const foundDog = pawsData?.dogs?.find(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.gps.toLowerCase() === searchTerm.toLowerCase(),
    );
    if (foundDog && foundDog.lat && foundDog.lon) {
      const lat = parseFloat(foundDog.lat);
      const lng = parseFloat(foundDog.lon);
      setIsToastActive(false);
      setMapCenter({ lat: lat, lng: lng });
      setZoom(25);
    } else {
      toast.error("No matching data found for your search.", {
        position: "top-right",
        autoClose: 1000,
        onClose: () => setIsToastActive(false),
      });
    }
  };

  return (
    <>
      <div className="homeContainer">
        <Header listType={listType} info={info} />
        <div className="homeContent">
          <div className="homeSearchContainer">
            <input
              type="text"
              className="homeSearch"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            {searchTerm.length > 0 ? (
              <>
                <FontAwesomeIcon
                  data-tooltip-id="homeSearch-tooltip"
                  icon={dogListData[0].iconName}
                  className="homeSearchIcon"
                  onClick={handleSearch}
                />
                <ReactTooltip
                  className="tooltip"
                  id="homeSearch-tooltip"
                  place="top"
                  content="Search"
                />
              </>
            ) : (
              <>
                <FontAwesomeIcon
                  data-tooltip-id="homeSearchClose-tooltip"
                  icon={dogListData[1].iconName}
                  className="homeSearchIcon"
                  style={{ display: "none" }}
                />
                <ReactTooltip
                  className="tooltip"
                  id="homeSearchClose-tooltip"
                  place="top"
                  content="Clear"
                />
              </>
            )}
          </div>
          <div className="homeDetails">
            {loading == false ? (
              <MapComponent
                pawsData={pawsData}
                mapCenter={mapCenter}
                zoom={zoom}
              />
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
        </div>
        <Footer listType={"Navigation"} />
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;
