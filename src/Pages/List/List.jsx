import React, { useEffect, useState } from "react";
import "./List.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faClose } from "@fortawesome/free-solid-svg-icons";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Footer from "../../Component/Footer/Footer";
import Header from "../../Component/Header/Header";
import {
  dogList,
  notificationList,
  volunteerList,
  emergencyList,
} from "../../redux/listSlice";
import { ColorRing } from "react-loader-spinner";
import "simplebar-react/dist/simplebar.min.css";
import SimpleBar from "simplebar-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import dog1 from"../../assets/dogimages/dog1.jpg";
// import dog2 from"../../assets/dogimages/dog2.jpg";
// import dog3 from"../../assets/dogimages/dog3.jpg";
// import dog4 from"../../assets/dogimages/dog4.jpg";
// import dog5 from"../../assets/dogimages/dog5.jpg";
// import dog6 from"../../assets/dogimages/dog6.jpg";
// import dog7 from"../../assets/dogimages/dog7.jpg";
// import dog8 from"../../assets/dogimages/dog8.jpg";
// import dog9 from"../../assets/dogimages/dog9.jpg";
// import dog10 from"../../assets/dogimages/dog10.jpg";
// import profilePic from"../../assets/user.png";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import ReactTextTruncate from "react-text-truncate";
import truncate from "truncate";

const dogListData = [
  { id: 1, name: "Search", iconName: faSearch },
  { id: 2, name: "Close", iconName: faClose },
];
// const dogsData = [
//   {id:0,identifier:12345,address:"1st street, thirumal nagar, gobi, erode",img:dog1,type:"dog"},
//   {id:1,identifier:12345,address:"1st street, thirumal nagar, gobi, erode",img:dog2,type:"dog"},
//   {id:2,identifier:12345,address:"1st street, thirumal nagar, gobi, erode",img:dog3,type:"dog"},
//   {id:3,identifier:12345,address:"1st street, thirumal nagar, gobi, erode",img:dog4,type:"dog"},
//   {id:4,identifier:12345,address:"1st street, thirumal nagar, gobi, erode",img:dog5,type:"dog"},
//   {id:5,identifier:12345,address:"1st street, thirumal nagar, gobi, erode",img:dog6,type:"dog"},
//   {id:6,identifier:12345,address:"1st street, thirumal nagar, gobi, erode",img:dog7,type:"dog"},
//   {id:7,identifier:12345,address:"1st street, thirumal nagar, gobi, erode",img:dog8,type:"dog"},
//   {id:8,identifier:12345,address:"1st street, thirumal nagar, gobi, erode",img:dog9,type:"dog"},
//   {id:9,identifier:12345,address:"1st street, thirumal nagar, gobi, erode",img:dog10,type:"dog"},
//   {id:10,identifier:"vivek",address:"5 street, thirumal nagar, gobi, erode",img:profilePic,type:"user"},
//   {id:11,identifier:"vino",address:"5 street, thirumal nagar, gobi, erode",img:profilePic,type:"user"},
//   {id:12,identifier:"chandru",address:"5 street, thirumal nagar, gobi, erode",img:profilePic,type:"user"},
//   {id:13,identifier:"sathiya",address:"5 street, thirumal nagar, gobi, erode",img:profilePic,type:"user"},
//   {id:14,identifier:"michael",address:"5 street, thirumal nagar, gobi, erode",img:profilePic,type:"user"},
//   {id:15,identifier:"tamil",address:"5 street, thirumal nagar, gobi, erode",img:profilePic,type:"user"},
//   {id:16,identifier:"sankar",address:"5 street, thirumal nagar, gobi, erode",img:profilePic,type:"user"},
//   {id:17,identifier:"thiru",address:"5 street, thirumal nagar, gobi, erode",img:profilePic,type:"user"},
//   {id:18,identifier:"vicky",address:"5 street, thirumal nagar, gobi, erode",img:profilePic,type:"user"},
//   {id:19,identifier:"55123 added succesfully",address:"8 mins ago",img:profilePic,type:"Notification"},
//   {id:20,identifier:"55125 added successfully",address:"1 hr ago",img:profilePic,type:"Notification"},
//   {id:21,identifier:"55134 need a medical emergency",address:"3 hrs ago",img:profilePic,type:"Notification"},
//   {id:22,identifier:"55122 got food",address:"Yesterday",img:profilePic,type:"Notification"},
//   {id:23,identifier:"Volunteer added successfully",address:"Sep 24",img:profilePic,type:"Notification"},
//   {id:24,identifier:"Volunteer added successfully",address:"Sep 24",img:profilePic,type:"Notification"},
//   {id:25,identifier:"55123*vivek",address:"Leg broken in left leg*8 mins ago",img:dog1,type:"Emergency"},
//   {id:26,identifier:"55125*arun",address:"Leg broken in right leg*1 hr ago",img:dog2,type:"Emergency"},
//   {id:27,identifier:"55134*pragu",address:"Burn wounds in stomach region*2 hr ago",img:dog3,type:"Emergency"},
//   {id:28,identifier:"55122*sudha",address:"Right side ribs broken*8 hr ago",img:dog4,type:"Emergency"},
//   {id:29,identifier:"55135*sanjay",address:"Rabies attack*Yesterday",img:dog5,type:"Emergency"},
//   {id:30,identifier:"55167*ram",address:"Vomiting continousl*Sep 24",img:dog6,type:"Emergency"},
// ]

const List = ({ listType, info }) => {
  const windowWidth = useSelector((state) => state.window.width);
  console.log(windowWidth + "list");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, listData, error } = useSelector((state) => state.lists);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = (listData || []).filter(
    (data) =>
      data.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.address.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const viewInfo = (info) => {
    if (listType == "dog") {
      navigate(`/dog/dogInfo?id=${info}`);
    } else if (listType == "user") {
      navigate(`/volunteer/volunteerInfo?id=${info}`);
    }
  };

  useEffect(() => {
    debugger;
    try {
      if (listType == "dog") {
        dispatch(dogList());
      } else if (listType == "user") {
        dispatch(volunteerList());
      } else if (listType == "Notification") {
        dispatch(notificationList());
      } else {
        console.log("emergency");
        dispatch(emergencyList());
      }
    } catch (error) {
      const message = error?.msg || "An unexpected error occurred";
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        //  onClose:()=> dispatch(dogInfo(id))
      });
    }
  }, [dispatch, listType]);

  return (
    <>
      <div className="listContainer">
        <Header listType={listType} info={info} />
        <div className="listContent">
          <div className="listSearchContainer">
            <input
              type="text"
              className="listSearch"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm.length > 0 ? (
              <>
                <FontAwesomeIcon
                  onClick={() => setSearchTerm("")}
                  data-tooltip-id="listSearchClose-tooltip"
                  icon={dogListData[1].iconName}
                  className="listSearchIcon"
                />
                <ReactTooltip
                  className="tooltip"
                  id="listSearchClose-tooltip"
                  place="top"
                  content="Clear"
                />
              </>
            ) : (
              <>
                <FontAwesomeIcon
                  data-tooltip-id="listSearch-tooltip"
                  icon={dogListData[0].iconName}
                  className="listSearchIcon"
                />
                {/* <ReactTooltip
                className="tooltip"
                id="listSearch-tooltip"
                place="top"
                content="Search"
                /> */}
              </>
            )}
          </div>
          <div className="listDetails">
            <SimpleBar style={{ maxHeight: "100%", cursor: "pointer" }}>
              {filteredData && filteredData.length > 0 ? (
                filteredData.map((data) => {
                  if (data.type === listType) {
                    const base64Data = `data:jpg;base64,${data.img}`;
                    return (
                      <div
                        className={
                          listType == "Emergency"
                            ? "listOfDetails EmerDetails"
                            : "listOfDetails"
                        }
                        key={data.id}
                        onClick={() => viewInfo(data.id)}
                      >
                        <div className="listImage">
                          <img
                            className="listProfileImg"
                            src={base64Data}
                            alt="No image"
                          />
                        </div>
                        <div
                          className={
                            listType == "Emergency"
                              ? "listInfo EmerInfo"
                              : "listInfo"
                          }
                        >
                          {listType == "Emergency" ? (
                            <>
                              <p className="listIdText">
                                {data.identifier.split("*")[0]}
                                <span className="listEmerTime">
                                  {data.address.split("*")[1]}
                                </span>
                              </p>
                              <p className="listIdText">{`Reported by ${data.identifier.split("*")[1]}`}</p>
                              <Tooltip title={data.address.split("*")[0]} arrow>
                                <p className="listInfoText">
                                  {truncate(data.address.split("*")[0], 25)}
                                  <span className="listEmerStatus online"></span>
                                </p>
                              </Tooltip>
                            </>
                          ) : (
                            <>
                              <Tooltip title={data.identifier} arrow>
                                <p className="listIdText">
                                  {windowWidth < 1024
                                    ? truncate(data.identifier, 20)
                                    : data.identifier}
                                </p>
                              </Tooltip>
                              <Tooltip title={data.address} arrow>
                                <p className="listInfoText">
                                  {truncate(data.address, 50)}
                                </p>
                              </Tooltip>
                            </>
                          )}

                          {listType == "Notification" && (
                            <span className="listNotifyNew">
                              <h6>NEW</h6>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  }
                })
              ) : loading ? (
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
                <div className="noRecords">
                  <p>No data available</p>
                </div>
              )}
            </SimpleBar>
          </div>
        </div>
        <Footer />
      </div>
      <ToastContainer />
    </>
  );
};

export default List;
