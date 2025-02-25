import { useState, useRef, useEffect } from "react";
import "./SignUp.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCircleUser,
  faSquarePhone,
  faAt,
  faStreetView,
  faTreeCity,
  faCity,
  faLocationDot,
  faPrescriptionBottleMedical,
  faLock,
  faLocationCrosshairs,
  faFileWaveform,
  faCameraRetro,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, fetchGeoLocation } from "../../redux/userSlice";
import { addDog } from "../../redux/dogSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fieldDetails = [
  {
    name: "User name",
    columnName: "uName",
    iconName: faCircleUser,
    id: 0,
    type: "user",
    value: "",
  },
  {
    name: "Mobile",
    columnName: "mobile",
    iconName: faSquarePhone,
    id: 1,
    type: "user",
    value: "",
  },
  {
    name: "Email",
    columnName: "email",
    iconName: faAt,
    id: 2,
    type: "user",
    value: "",
  },
  {
    name: "Street",
    columnName: "uStreet",
    iconName: faStreetView,
    id: 3,
    type: "user",
    value: "",
  },
  {
    name: "Area",
    columnName: "uArea",
    iconName: faTreeCity,
    id: 4,
    type: "user",
    value: "",
  },
  {
    name: "City",
    columnName: "uCity",
    iconName: faCity,
    id: 5,
    type: "user",
    value: "",
  },
  {
    name: "State",
    columnName: "uState",
    iconName: faLocationDot,
    id: 6,
    type: "user",
    value: "",
  },
  {
    name: "Vaccine",
    columnName: "uVaccine",
    iconName: faPrescriptionBottleMedical,
    id: 7,
    type: "user",
    value: false,
  },
  {
    name: "Password",
    columnName: "uPassword",
    iconName: faLock,
    id: 8,
    type: "user",
    value: "",
  },
  {
    name: "GPS number",
    columnName: "gps",
    iconName: faLocationCrosshairs,
    id: 9,
    type: "dog",
    value: "",
  },
  {
    name: "Street",
    columnName: "dStreet",
    iconName: faStreetView,
    id: 10,
    type: "dog",
    value: "",
  },
  {
    name: "Area",
    columnName: "dArea",
    iconName: faTreeCity,
    id: 11,
    type: "dog",
    value: "",
  },
  {
    name: "City",
    columnName: "dCity",
    iconName: faCity,
    id: 12,
    type: "dog",
    value: "",
  },
  {
    name: "State",
    columnName: "dState",
    iconName: faLocationDot,
    id: 13,
    type: "dog",
    value: "",
  },
  {
    name: "Vaccine",
    columnName: "dVaccine",
    iconName: faPrescriptionBottleMedical,
    id: 14,
    type: "dog",
    value: false,
  },
  {
    name: "Medical description",
    columnName: "medicalDesc",
    iconName: faFileWaveform,
    id: 15,
    type: "dog",
    value: "",
  },
];

const FieldContent = ({ type, handleChange, handleCheckboxChange }) => {
  return (
    <div className="inputContent">
      {fieldDetails.map(
        (field) =>
          type === field.type && (
            <div className="inputFields" key={field.id}>
              <div className="inputlabel">
                <span className="labelicons">
                  <FontAwesomeIcon
                    data-tooltip-id={`${field.name}` + "-tooltip"}
                    icon={field.iconName}
                    className="iconsList"
                  />
                </span>
              </div>
              <div
                className={
                  field.name == "Vaccine"
                    ? "contentField vaccBox"
                    : "contentField"
                }
              >
                {type == "dog" && field.id == 15 ? (
                  <textarea
                    className="textBox"
                    rows={3}
                    columns={10}
                    placeholder={field.name}
                    name={field.columnName}
                    value={field.value}
                    onChange={handleChange}
                    maxLength="300"
                  ></textarea>
                ) : field.name === "Vaccine" ? (
                  <input
                    type={"checkbox"}
                    className="inputBox"
                    placeholder={field.name}
                    name={field.columnName}
                    checked={field.value}
                    onChange={handleCheckboxChange}
                    autoComplete="off"
                  />
                ) : (
                  <input
                    type={field.name === "Mobile" ? "number" : "text"}
                    className="inputBox"
                    placeholder={field.name}
                    name={field.columnName}
                    value={field.value}
                    onChange={handleChange}
                    maxLength={field.name === "Mobile" ? 10 : 150}
                    autoComplete="off"
                  />
                )}
              </div>
              <ReactTooltip
                className="tooltip"
                id={`${field.name}` + "-tooltip"}
                place="top"
                content={field.name}
              />
            </div>
          ),
      )}
    </div>
  );
};

const SignUp = ({ type }) => {
  const [image, setImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [base64, setBase64] = useState("");
  const [isToastActive, setIsToastActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const pathLocation = useLocation();
  const [formData, setFormData] = useState({
    uName: "",
    mobile: "",
    email: "",
    uStreet: "",
    uArea: "",
    uCity: "",
    uState: "",
    uVaccine: false,
    uPassword: "",
    uImgData: "",
  });
  const [dogData, setDogData] = useState({
    gps: "",
    dStreet: "",
    dArea: "",
    dCity: "",
    dState: "",
    dVaccine: false,
    medicalDesc: "",
    dImgData: "",
  });

  const { loading, error, location } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData(() => {
      fieldDetails.map((field) => {
        if (field.columnName === e.target.name) {
          field.value = e.target.value;
        }
      });
    });
    if (type == "dog") {
      setDogData({ ...dogData, [e.target.name]: e.target.value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleCheckboxChange = (e) => {
    fieldDetails.map((field) => {
      if (field.columnName === e.target.name) {
        field.value = e.target.checked;
      }
    });
    if (type == "dog") {
      setDogData({
        ...dogData,
        dVaccine: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        uVaccine: e.target.checked,
      });
    }
  };
  const validation = () => {
    if (isToastActive) return;
    setIsToastActive(true);
    if (image == null) {
      toast.error("Please upload an image!", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => setIsToastActive(false),
      });
      return false;
    }

    if (!formData.uName.trim()) {
      toast.error("Username is required!", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => setIsToastActive(false),
      });
      return false;
    }
    if (!formData.mobile.trim()) {
      toast.error("Mobile is required!", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => setIsToastActive(false),
      });
      return false;
    } else {
      const indianMobileRegex = /^[789]\d{9}$/;
      if (
        formData.mobile.length > 10 ||
        formData.mobile.length < 10 ||
        !indianMobileRegex.test(formData.mobile)
      ) {
        toast.error("Incorrect mobile number", {
          position: "top-right",
          autoClose: 3000,
          onClose: () => setIsToastActive(false),
        });
        return false;
      }
    }
    if (!formData.email.trim()) {
      toast.error("Email is required!", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => setIsToastActive(false),
      });
      return false;
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Invalid email address!", {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }
    }
    if (!formData.uStreet.trim()) {
      toast.error("Street is required!", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => setIsToastActive(false),
      });
      return false;
    }
    if (!formData.uCity.trim()) {
      toast.error("City is required!", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => setIsToastActive(false),
      });
      return false;
    }
    if (!formData.uArea.trim()) {
      toast.error("Area is required!", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => setIsToastActive(false),
      });
      return false;
    }
    if (!formData.uState.trim()) {
      toast.error("State is required!", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => setIsToastActive(false),
      });
      return false;
    }
    if (!formData.uPassword.trim()) {
      toast.error("Password is required!", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => setIsToastActive(false),
      });
      return false;
    } else {
      if (formData.uPassword.length < 8 || formData.uPassword.length > 8) {
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

  const dogValidation = () => {
    if (isToastActive) return;
    setIsToastActive(true);
    if (image == null) {
      toast.error("Please upload an image!", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => setIsToastActive(false),
      });
      return false;
    }
    if (!dogData.gps.trim()) {
      toast.error("Required GPS number!", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => setIsToastActive(false),
      });
      return false;
    } else {
      const gpsRegex = /^\d{15}$/;
      if (!gpsRegex.test(dogData.gps)) {
        toast.error("Incorrect GPS number", {
          position: "top-right",
          autoClose: 3000,
          onClose: () => setIsToastActive(false),
        });
        return false;
      }
    }
    if (!dogData.dStreet.trim()) {
      toast.error("Street is required!", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => setIsToastActive(false),
      });
      return false;
    }
    if (!dogData.dArea.trim()) {
      toast.error("Area is required!", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => setIsToastActive(false),
      });
      return false;
    }
    if (!dogData.dCity.trim()) {
      toast.error("City is required!", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => setIsToastActive(false),
      });
      return false;
    }
    if (!dogData.dState.trim()) {
      toast.error("State is required!", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => setIsToastActive(false),
      });
      return false;
    }
    if (!dogData.medicalDesc.trim()) {
      toast.error("medical status is required!", {
        position: "top-right",
        autoClose: 3000,
        onClose: () => setIsToastActive(false),
      });
      return false;
    }

    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type == "dog") {
      if (dogValidation()) {
        setIsToastActive(false);
        Object.keys(dogData).forEach((key) => {
          if (key === "dImgData") {
            dogData[key] = base64;
          } else if (key === "dVaccine") {
            dogData[key] = dogData[key] === true ? 1 : 0;
          } else if (key === "medicalDesc") {
            dogData[key] = dogData[key]
              .split("\n")
              .map((line) => line.trim())
              .filter((line) => line !== "")
              .join(" ");
          }
        });
        try {
          const Data = await dispatch(
            addDog({
              ...dogData,
              dLat: location.latitude,
              dLong: location.longitude,
            }),
          ).unwrap();
          toast.success("Dog added successfully", {
            position: "top-right",
            autoClose: 1000,
            onClose: () => {
              setIsToastActive(false);
              navigate("/dogs");
            },
          });
        } catch (err) {
          console.log(err);
          const message = err.msg || "An unexpected error occurred";
          if (message == "un authorized access") {
            navigate("/");
          } else {
            toast.error(`Dog added failed: ${message}`, {
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
      }
    } else {
      if (validation()) {
        setIsToastActive(false);
        Object.keys(formData).forEach((key) => {
          if (key === "uImgData") {
            formData[key] = base64;
          } else if (key === "mobile") {
            formData[key] = Number(formData[key]);
          } else if (key === "uVaccine") {
            formData[key] = formData[key] === true ? 1 : 0;
          }
        });
        try {
          const userData = await dispatch(signupUser(formData)).unwrap();

          toast.success("Volunteer signed up successfully", {
            position: "top-right",
            autoClose: 1000,
            onClose: () => {
              setIsToastActive(false);
              navigate("/");
            },
          });
        } catch (err) {
          console.log(err);
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
    }
  };

  const imageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      let base64Data = "";
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
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        base64Data = reader.result.split(",")[1];
        setBase64(base64Data);
      };
      reader.readAsDataURL(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    }
  };

  const openFile = () => {
    fileInputRef.current.click();
  };

  // Go back to the previous page
  const handleGoBack = () => {
    const currentPath = pathLocation.pathname;
    if (window.history.length > 1) {
      debugger;
      if (currentPath == "/volunteers" || currentPath == "/dogs") {
        return navigate("/home");
      }
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    try {
      dispatch(fetchGeoLocation());
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <div className="signupContainer">
        <div className="headerBtn">
          <span className="backiconbox">
            <FontAwesomeIcon
              data-tooltip-id="backicon-tooltip"
              icon={faArrowLeft}
              className="backicon"
              onClick={handleGoBack}
            />
          </span>
          <ReactTooltip
            className="tooltip"
            id="backicon-tooltip"
            place="bottom"
            content="Go back"
          />
          <span className="signupText">{type == "dog" ? "Dog" : "Signup"}</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="signupContent">
            <div className="imgContent logo" onClick={openFile}>
              {!imagePreviewUrl && (
                <FontAwesomeIcon
                  data-tooltip-id="uploadImg-tooltip"
                  icon={faCameraRetro}
                  className="uploadImg"
                />
              )}

              {imagePreviewUrl && (
                <img
                  className="profileImage"
                  src={imagePreviewUrl}
                  alt="app-logo"
                />
              )}
              <ReactTooltip
                className="tooltip"
                id="uploadImg-tooltip"
                place="top"
                content="Add photo"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/"
                style={{ display: "none" }}
                onChange={imageUpload}
                name="uImgData"
              />
            </div>
            <div className="inputContent">
              <FieldContent
                type={type}
                handleChange={handleChange}
                handleCheckboxChange={handleCheckboxChange}
              />
            </div>
            <div
              className={
                type == "dog"
                  ? "signupBtnContainer addDogBtnContainer"
                  : "signupBtnContainer"
              }
            >
              {type == "user" ? (
                <button type="submit" disabled={loading} className="signupBtn">
                  Signup
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="signupBtn addDog"
                >
                  Add Dog
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
      {/* <span class="material-icons">pie_chart</span> */}
    </>
  );
};

export default SignUp;
