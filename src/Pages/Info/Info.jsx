import React, { useState, useRef, useEffect } from "react";
import "./Info.css";
import Header from "../../Component/Header/Header";
import Footer from "../../Component/Footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import profilePic from "../../assets/user.png";
import dog1 from "../../assets/dogimages/dog1.jpg";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  dogEdit,
  dogInfo,
  settingInfo,
  settingEdit,
  editField,
  saveField,
} from "../../redux/dogSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { MagnifyingGlass, ColorRing } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { volunteerInfo } from "../../redux/userSlice";
// const infoData = [
//     {id:0,header:"Paw GPS",info:"",previledge:true,type:"dog",edit:false},
//     {id:1,header:"Vaccine",info:"",previledge:true,type:"dog",edit:false},
//     {id:2,header:"Medical information",info:"",previledge:true,type:"dog",edit:false},
//     {id:3,header:"Street",info:"",previledge:true,type:"dog",edit:false},
//     {id:4,header:"Area",info:"",previledge:true,type:"dog",edit:false},
//     {id:5,header:"District",info:"",previledge:true,type:"dog",edit:false},
//     {id:6,header:"State",info:"",previledge:true,type:"dog",edit:false},
//     {id:7,header:"Name",info:"Vivek",previledge:false,type:"user",edit:false},
//     {id:8,header:"Id",info:"12345",previledge:false,type:"user",edit:false},
//     {id:9,header:"Street",info:"1st street",previledge:false,type:"user",edit:false},
//     {id:10,header:"Area",info:"Thillai nagar",previledge:false,type:"user",edit:false},
//     {id:11,header:"District",info:"Thanjavur",previledge:false,type:"user",edit:false},
//     {id:12,header:"State",info:"Tamilnadu",previledge:false,type:"user",edit:false},
//     {id:13,header:"Name",info:"Vivek",previledge:true,type:"Setting",edit:false},
//     {id:14,header:"Id",info:"12345",previledge:true,type:"Setting",edit:false},
//     {id:15,header:"Area",info:"Thillai nagar",previledge:true,type:"Setting",edit:false},
//     {id:16,header:"District",info:"Thanjavur",previledge:true,type:"Setting",edit:false},
//     {id:17,header:"State",info:"Tamilnadu",previledge:true,type:"Setting",edit:false},
//     {id:18,header:"Email",info:"vivek@gmail.com",previledge:true,type:"Setting",edit:false},
//     {id:19,header:"Mobile",info:"9876543210",previledge:true,type:"Setting",edit:false},
//     {id:20,header:"Password",info:"******",previledge:true,type:"Setting",edit:false},
// ]
const Info = ({ listType, info }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, infoData, imgData } = useSelector((state) =>
    listType == "dog" || listType == "Setting" ? state.dog : state.user,
  );
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [isAdmin, setIsAdmin] = useState(0);
  const token = localStorage.getItem("jwt");

  // const [image,setImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [localValue, setLocalValue] = useState("");
  const [isToastActive, setIsToastActive] = useState(false);

  const fileInputRef = useRef(null);

  const imageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error("File size should not exceed 1MB.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      const allowedTypes = ["image/jpg", "image/jpeg"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, JPEG files are allowed.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result.split(",")[1];

        try {
          listType == "dog"
            ? await dispatch(dogEdit({ id: id, dimgData: base64Data })).unwrap()
            : await dispatch(settingEdit({ uImgData: base64Data })).unwrap();
          toast.success(
            listType == "dog"
              ? "Dog updated succesfully!"
              : "User updated successfully",
            {
              position: "top-right",
              autoClose: 1000,
              onClose: () => {
                listType == "dog"
                  ? dispatch(dogInfo(id))
                  : dispatch(settingInfo());
              },
            },
          );
          // Refresh data
        } catch (error) {
          const message = error?.msg || "An unexpected error occurred";
          toast.error(message, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const openFile = () => {
    if (listType != "user") {
      fileInputRef.current.click();
    }
  };

  const handleChange = async (e, fieldId, fieldName) => {
    if (
      (e.key == "Enter" || e.type == "click") &&
      Validation(fieldName, e.target.value)
    ) {
      dispatch(saveField({ id: fieldId, value: e.target.value }));
      try {
        listType == "dog"
          ? await dispatch(
              dogEdit({ id: id, [fieldName]: localValue }),
            ).unwrap()
          : await dispatch(settingEdit({ [fieldName]: localValue })).unwrap();
          console.log(localValue);
        toast.success(
          listType == "dog"
            ? "Dog updated succesfully!"
            : "User updated successfully",
          {
            position: "top-right",
            autoClose: 1000,
          },
        );
      } catch (error) {
        const message = error?.msg || "An unexpected error occurred";
        toast.error(message, {
          position: "top-right",
          autoClose: 3000,
          onClose: () =>
            listType == "dog" ? dispatch(dogInfo(id)) : dispatch(settingInfo()),
        });
      }
    }
  };

  const Validation = (field, value) => {
    debugger
    if (isToastActive) return;
    setIsToastActive(true);
    if (field != "dVaccine") {
      if (!value.trim() && field == "gps") {
        toast.error("Required GPS number!", {
          position: "top-right",
          autoClose: 3000,
          onClose: () => setIsToastActive(false),
        });
        return false;
      } else {
        const gpsRegex = /^\d{15}$/;
        if (!gpsRegex.test(value) && field == "gps") {
          toast.error("Incorrect GPS number", {
            position: "top-right",
            autoClose: 3000,
            onClose: () => setIsToastActive(false),
          });
          return false;
        }
      }
      if (!value.trim() && field == "dStreet") {
        toast.error("Street is required!", {
          position: "top-right",
          autoClose: 3000,
          onClose: () => setIsToastActive(false),
        });
        return false;
      }
      if (!value.trim() && field == "dArea") {
        toast.error("Area is required!", {
          position: "top-right",
          autoClose: 3000,
          onClose: () => setIsToastActive(false),
        });
        return false;
      }
      if (!value.trim() && field == "dCity") {
        toast.error("City is required!", {
          position: "top-right",
          autoClose: 3000,
          onClose: () => setIsToastActive(false),
        });
        return false;
      }
      if (!value.trim() && field == "dState") {
        toast.error("State is required!", {
          position: "top-right",
          autoClose: 3000,
          onClose: () => setIsToastActive(false),
        });
        return false;
      }
      if (!value.trim() && field == "medicalDesc") {
        toast.error("medical status is required!", {
          position: "top-right",
          autoClose: 3000,
          onClose: () => setIsToastActive(false),
        });
        return false;
      }
    }
    return true;
  };

  const userValidation = (field, value) => {
    if (isToastActive) return;
    setIsToastActive(true);
    if (field != "uVaccine") {
      if (!value.trim() && field == "uName") {
        toast.error("Name is required!", {
          position: "top-right",
          autoClose: 3000,
          onClose: () => setIsToastActive(false),
        });
        return false;
      }

      if (!value.trim() && field == "uStreet") {
        toast.error("Street is required!", {
          position: "top-right",
          autoClose: 3000,
          onClose: () => setIsToastActive(false),
        });
        return false;
      }
      if (!value.trim() && field == "uArea") {
        toast.error("Area is required!", {
          position: "top-right",
          autoClose: 3000,
          onClose: () => setIsToastActive(false),
        });
        return false;
      }
      if (!value.trim() && field == "uCity") {
        toast.error("City is required!", {
          position: "top-right",
          autoClose: 3000,
          onClose: () => setIsToastActive(false),
        });
        return false;
      }
      if (!value.trim() && field == "uState") {
        toast.error("State is required!", {
          position: "top-right",
          autoClose: 3000,
          onClose: () => setIsToastActive(false),
        });
        return false;
      }
      if (!value.trim() && field == "email") {
        toast.error("Email is required!", {
          position: "top-right",
          autoClose: 3000,
          onClose: () => setIsToastActive(false),
        });
        return false;
      } else {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value) && field == "email") {
          toast.error("Invalid email address!", {
            position: "top-right",
            autoClose: 3000,
          });
          return false;
        }
      }
      if (!value.trim() && field == "mobile") {
        toast.error("Mobile is required!", {
          position: "top-right",
          autoClose: 3000,
          onClose: () => setIsToastActive(false),
        });
        return false;
      } else {
        const indianMobileRegex = /^[789]\d{9}$/;
        if (
          field == "mobile" &&
          (value.length > 10 ||
            value.length < 10 ||
            !indianMobileRegex.test(value))
        ) {
          toast.error("Incorrect mobile number", {
            position: "top-right",
            autoClose: 3000,
            onClose: () => setIsToastActive(false),
          });
          return false;
        }
      }
    }
    return true;
  };

  const saveFieldData = async (fieldId, fieldName) => {
    debugger
    if (
      listType == "dog"
        ? Validation(fieldName, localValue)
        : userValidation(fieldName, localValue)
    ) {
      dispatch(saveField({ id: fieldId, value: localValue }));
      try {
        listType == "dog"
          ? await dispatch(
              dogEdit({ id: id, [fieldName]: localValue }),
            ).unwrap()
          : await dispatch(settingEdit({ [fieldName]: localValue })).unwrap();
        toast.success(
          listType == "dog"
            ? "Dog updated succesfully!"
            : "User updated successfully",
          {
            position: "top-right",
            autoClose: 1000,
            onClose:()=>setIsToastActive(false),
          },
        );
      } catch (error) {
        const message = error?.msg || "An unexpected error occurred";
        toast.error(message, {
          position: "top-right",
          autoClose: 3000,
          onClose: () =>
            listType == "dog" ? dispatch(dogInfo(id)) : dispatch(settingInfo()),
        });
      }
    }
  };

  const handleCheckboxChange = (e) => {
    setLocalValue(e.target.checked);
  };

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.isAdmin);
    }
    try {
      listType == "dog"
        ? dispatch(dogInfo(id))
        : listType == "user"
          ? dispatch(volunteerInfo(id))
          : dispatch(settingInfo());
    } catch (error) {
      const message = error?.msg || "An unexpected error occurred";
      toast.error(message, {
        position: "top-right",
        autoClose: 1000,
        onClose: () => navigate(listType == "dog" ? "/dogs" : "/volunteers"),
      });
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!imgData) return;
    const base64Data = `data:image/jpeg;base64,${imgData}`;
    console.log("image upload");
    console.log(base64Data);
    setImagePreviewUrl(base64Data);
    console.log(imagePreviewUrl)
  }, [imgData]);
  useEffect(() => {
   console.log("imagepreviewurl:",imagePreviewUrl)
  }, [imagePreviewUrl])
  
  return (
    <>
      <div className="infoContainer">
        <Header listType={listType} info={info} />
        <div
          className={
            listType == "Setting" ? "infoContent settingContent" : "infoContent"
          }
        >
          <div className="infoImgContanier">
            <div className="infoProfilePic" onClick={openFile}>
              <img src={imagePreviewUrl} alt="" className="infoProfileImg" />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/"
                style={{ display: "none" }}
                onChange={imageUpload}
              />
            </div>
            <div className="infotext">Information</div>
          </div>
          <div className="infoListOfDetails">
            {loading ? (
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
              infoData.map(
                (list) =>
                  list.type == listType && (
                    <div
                      className={
                        listType == "Setting"
                          ? "infoList settingList"
                          : "infoList"
                      }
                      key={list.id}
                    >
                      <div className="infoTextDetails">
                        <p className="infoHeaderText">{list.header}</p>
                        {!list.edit ? (
                          list.header == "Vaccine" ? (
                            <input
                              type={"checkbox"}
                              className="infoVaccineChkBx"
                              checked={list.info}
                              disabled={!list.edit}
                            />
                          ) : (
                            <p className="infoDetailText">{list.info}</p>
                          )
                        ) : list.header == "Vaccine" ? (
                          <input
                            type={"checkbox"}
                            className="infoVaccineChkBx"
                            checked={localValue}
                            onChange={handleCheckboxChange}
                          />
                        ) : (
                          <input
                            placeholder={`Enter ${list.header}`}
                            type={list.field === "mobile" ? "number" : "text"}
                            value={localValue}
                            name={list.field}
                            maxLength={
                              list.field === "mobile"
                                ? 10
                                : list.field === "gps"
                                  ? 15
                                  : 150
                            }
                            className={
                              listType == "Setting"
                                ? "infoEditInput settingEditInput"
                                : "infoEditInput"
                            }
                            onChange={(e) => setLocalValue(e.target.value)}
                            onKeyDown={(e) =>
                              handleChange(e, list.id, list.field)
                            }
                          />
                        )}
                      </div>
                      {list.previledge && isAdmin == 1 && (
                        <div className="infoIcons">
                          {!list.edit ? (
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              className="infoEditIcon"
                              onClick={() => {
                                dispatch(editField(list.id));
                                setLocalValue(list.info);
                              }}
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faFloppyDisk}
                              className="infoEditIcon"
                              onClick={() => saveFieldData(list.id, list.field)}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ),
              )
            )}
          </div>
        </div>
        {listType != "Setting" && <Footer />}
      </div>
      <ToastContainer />
    </>
  );
};

export default Info;
