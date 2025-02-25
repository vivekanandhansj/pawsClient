import { useState, useCallback, useEffect, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  OverlayView,
} from "@react-google-maps/api";
import "./MapComponent.css";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faDog } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { setDogPopData, setMarkerClicked, setOpenPopup } from "../../redux/homeSlice";
import NavigatePopup from "../Popup/NavigatePopup/NavigatePopup";
import FeedPopup from "../Popup/FeedPopup/FeedPopup";
import SuccessPopup from "../Popup/SuccessPopup/SuccessPopup";
import { ColorRing } from "react-loader-spinner";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// URLs for icons
const emerImg =
  "https://media-hosting.imagekit.io//20b0e536d01b4462/emergency.png?Expires=1831230398&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=pVBhSs95v4GPUAbAX~3EHF5BCWNZwC6mDcAnUO9eynMGXm5tUwIrlTWOY5ilhblNa1~4goszqB95UjY9uJCBjqeayJaVcyTiWzggLy4K2ZNUD~-sK7YTBJQkRRZPbnGrcFQEQhgcMdf~FoBoBSnAb06ekTPWBlvbCSpsLnhaqF3KFTGgY9nCJ8FtyzF~RL7ovENuvX51A60Z8GNrqsADDy42exzMLBtbsE8DJJCP7CbViyQwKwhOjPAwtZxclnrPMqMh3Lmlq3P~4JRH~GklsYOCW~c0vEETOGPa717pABj5z~d3Umu5LJGN9RsmRQYaA6IdpLC-dls1060jPdHvNw__";
const unFeedImg =
  "https://media-hosting.imagekit.io//9c712c1b9e3e4d8b/feedMarker.PNG?Expires=1831037792&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=NEVjYPHVJ95b3TiU1-fWedgQ~qWeSDeaQ7UMVbIt3tg09ZKdzAyqt69l6t-LK47nqKmeWVQY9XQEa3l~rCV5m9YnJEf99UOmsnrIiVwpEQqLznOa1HXv9ysXI0S1Dvwlpb3dm0AlGTokLiX4MJ6OHTlpQuSYQKMBQGiDUbyZu24tTS0NLaVYXwGnFlBHspBaNT0QLsThPs4ig9FUHUS2k4m1MlAVDy8V6WQePRmaQSF58y7CTovyM22LW-oQHtSl29CFOc3~0Db2YWMNEBCDqSlS-hx2z3PbJQjnVzAsawEwWlspvp8gs5lx~8B~Rizvs11VkcrAyWK-LSZ~vyrKIQ__";
const feedImg =
  "https://media-hosting.imagekit.io//9cea6ee306cf4894/nonFeedMarker.png?Expires=1831042621&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=vtotgjYlXKwp7j5LfEWNfnR9FKynrtHiPEFBML7KuG6jx05o8G7mgfi3XBjPv2u4VlFagTUSRxDlu8oD0y5cYwpZgwDnkOooA-NxCNUg7PRXV7oIoH-gLDTwuzYbqM0nnzLP~qpzhGamnIKI-cHZ1nSq6BsJx7pNG8jHXKnmpjLZJsiIBVvJXIAZEYfbhp8pEmXQwdM5b8x8r8CLw7J3FNziS7n1d~mBGI1cq9zbipTlVP5njN7qt1YL2mMgw9Y~fL-JztaMXHvv8Rh731vSokN3BKmC1dNMcBzhtGMckmu5zE-VE8mlnGsFJx4zPzFZzVhPwJ0Y5Vjh~XMMhX-iVA__";
const userIcon =
  "https://media-hosting.imagekit.io//2b0bfa480e3b48fc/person.png?Expires=1831057230&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=sYupi4n9K7UeI4JuUiYAXySwsUFnYM5a2cJl~7u0xtx34KE49TMOWZLu028tmBOHh8Zsz5DbuStrWMQVHa1UFJEinVumYW-bQklgdZf0BFNzuWKC~7LlwuKTSTN93y2jgg7FAsO-aI5pd9IYZGeewK2B5eGlBbX7oXkG2Oj4aRzpP~MIcipVmRcH3GAVEhawU3qO4eiujTLejXNx7uJd6zzbtUwVeeZFnKYsg7USOhTfXIHuP3fr9P-v3~m5aIgN7QLDZCCMaYGe-x~XB3RDLBtSBF7bYSkSaGja~181sxSwhyzCf5S2jG9s30Jug~UFh1-WaMx5bg8ymMGpwSXu0Q__";

const MapComponent = ({ pawsData, mapCenter, zoom }) => {
  const windowWidth = useSelector((state) => state.window.width);
  const markerClicked = useSelector((state) => state.home.markerClicked);

const markerClickedRef = useRef(markerClicked);
  
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GMAP_API,
  });

  const [map, setMap] = useState(null);
  const [center,setCenter]=useState({
    lat:parseFloat(pawsData.user.lat),
    lng:parseFloat(pawsData.user.lon)
  })
  const [directionLine, setDirectionLine] = useState(null);
  const [dashedLineStart, setDashedLineStart] = useState(null);
  const [dashedLineEnd, setDashedLineEnd] = useState(null);
  const [userLocMarker,setUserLocMarker] = useState(null);

  const [infoWindow, setInfoWindow] = useState({
    isVisible: false,
    position: null,
    name: "",
    image: "",
    class: "",
    gps: "",
  });

  const dispatch = useDispatch();
  const { openPopup } = useSelector((state) => state.home);

  const onLoad = useCallback(
    (map) => {
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);
      setMap(map);
      createClusterer(map);
      map.setCenter(mapCenter || center);
      map.setZoom(zoom || 8);
    },
    [mapCenter, zoom],
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const createClusterer = (map) => {
    const markers = pawsData.dogs.map((dog) => {
      const marker = new google.maps.Marker({
        position: { lat: parseFloat(dog.lat), lng: parseFloat(dog.lon) },
        map: map,
        icon: {
          url:
            dog.isEmer == 1 ? emerImg : dog.isFeed == 1 ? feedImg : unFeedImg,
          scaledSize: new google.maps.Size(40, 35),
          anchor: new google.maps.Point(30, 30),
        },
      });

      marker.addListener("mouseover", () => handleMouseOver(dog));
      marker.addListener("mouseout", handleMouseOut);
      marker.addListener("click", () => {
        if (markerClickedRef.current) {
          showNavPop(dog);
          dispatch(setMarkerClicked(false)); // Update Redux state
        }
      });
      return marker;
    });

    const userMarker = new google.maps.Marker({
      position: {
        lat: parseFloat(pawsData.user.lat),
        lng: parseFloat(pawsData.user.lon),
      },
      map: map,
      icon: {
        url: userIcon,
        scaledSize: new google.maps.Size(40, 35),
        anchor: new google.maps.Point(15, 15),
      },
    });

    setUserLocMarker(userMarker);

    // Add custom overlay for the user icon
    const userOverlay = new google.maps.OverlayView();
    userOverlay.onAdd = function () {
      const div = document.createElement("div");
      div.className = "user-marker-overlay";
      div.style.position = "absolute";
      div.style.width = "40px";
      div.style.height = "40px";
      div.style.top = "-20px";
      div.style.left = "-20px";
      this.getPanes().overlayLayer.appendChild(div);
    };

    userOverlay.draw = function () {
      const projection = this.getProjection();
      const position = projection.fromLatLngToDivPixel(
        userMarker.getPosition(),
      );
      const div = this.getPanes().overlayLayer.firstChild;
      div.style.left = position.x + "px";
      div.style.top = position.y + "px";
    };

    userOverlay.setMap(map);

    new MarkerClusterer({ markers: [...markers, userMarker], map });
  };

  const handleMouseOver = (marker) => {
    setInfoWindow({
      isVisible: true,
      position: { lat: parseFloat(marker.lat), lng: parseFloat(marker.lon) },
      name: marker.name,
      image: marker.img,
      class: marker.isFeed == 1 ? "infoFeed" : "infoUnFeed",
      gps: marker.gps,
    });
  };

  const handleMouseOut = () => {
    setInfoWindow({
      isVisible: false,
      position: null,
      name: "",
      image: "",
      class: "",
      gps: "",
    });
  };

  const showNavPop = (dog) => {
    dispatch(setOpenPopup(1));
    dispatch(setDogPopData(dog));
  };

  // user to dog nvigation route

  const handlePolyline = () => {
    if (directionLine) {
      directionLine.setMap(null);
      setDirectionLine(null); // Remove existing polyline
      dashedLineStart.setMap(null);
      setDashedLineStart(null);
      dashedLineEnd.setMap(null);
      setDashedLineEnd(null);
    }
  };

  const calculateRoute = async (dog) => {
    if (!pawsData.user || !dog) return;
    const userLocation = {
      lat: parseFloat(pawsData.user.lat),
      lng: parseFloat(pawsData.user.lon),
    };
    const dogLocation = {
      lat: parseFloat(dog.lat),
      lng: parseFloat(dog.lon),
    };

    try {
      const snapToRoad = async (location) => {
        const response = await fetch(
          `https://roads.googleapis.com/v1/nearestRoads?key=${import.meta.env.VITE_GMAP_API}&points=${location.lat},${location.lng}`,
        );
        const data = await response.json();
        return data.snappedPoints
          ? {
              lat: data.snappedPoints[0].location.latitude,
              lng: data.snappedPoints[0].location.longitude,
            }
          : location;
      };

      const userSnappedPoint = await snapToRoad(userLocation);
      const dogSnappedPoint = await snapToRoad(dogLocation);

      const newOffRoadPath = [
        userLocation,
        userSnappedPoint,
        dogSnappedPoint,
        dogLocation,
      ];
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin: userSnappedPoint,
          destination: dogSnappedPoint,
          travelMode: google.maps.TravelMode.WALKING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            handlePolyline();
            const path = result.routes[0].overview_path.map((point) => ({
              lat: point.lat(),
              lng: point.lng(),
            }));
            const onRoadPath = [
              newOffRoadPath[1],
              ...path.slice(1, path.length - 1),
              newOffRoadPath[2],
            ];

            // Define the Polyline
            const newDirectionLine = new google.maps.Polyline({
              path: onRoadPath, // Array of LatLng points
              strokeColor: "#0f53ff", // Custom stroke color
              strokeOpacity: 1, // Line opacity
              strokeWeight: 10, // Line thickness
            });

            newDirectionLine.setMap(map);
            setDirectionLine(newDirectionLine);

            // Define the Polyline with custom icons for dashed styling
            const newDashedLineStart = new google.maps.Polyline({
              path: newOffRoadPath?.filter((point, index) => index <= 1),
              strokeOpacity: 0, // Make the main line transparent
              icons: [
                {
                  icon: {
                    path: "M 0,-1 0,1", // Custom dash pattern
                    strokeOpacity: 1,
                    strokeWeight: 5, // Dash height
                    strokeColor: "#BCCEFB", // Dash color
                  },
                  offset: "25%", // Position offset
                  repeat: "15px", // Spacing between dashes
                },
              ],
            });
            newDashedLineStart.setMap(map);
            setDashedLineStart(newDashedLineStart);

            // Define the Polyline with custom icons for dashed styling
            const newDashedLineEnd = new google.maps.Polyline({
              path: newOffRoadPath?.filter((point, index) => index > 1),
              strokeOpacity: 0, // Make the main line transparent
              icons: [
                {
                  icon: {
                    path: "M 0,-1 0,1", // Custom dash pattern
                    strokeOpacity: 1,
                    strokeWeight: 5, // Dash height
                    strokeColor: "#BCCEFB", // Dash color
                  },
                  offset: "25%", // Position offset
                  repeat: "15px", // Spacing between dashes
                },
              ],
            });
            newDashedLineEnd.setMap(map);
            setDashedLineEnd(newDashedLineEnd);
                      // Combine paths: first the off-road dashed line, then the on-road path
                      console.log(newOffRoadPath);
                      console.log(path);
                      const fullPath = [newOffRoadPath[0], ...path,newOffRoadPath[3]];
                     console.log(fullPath)
                      animateUserMarker(fullPath);
                      
          } else {
            console.log("Error fetching directions:", status);
          }
        },
      );
    } catch (error) {
      console.log("Error calculating route: ", error);
    }
  };

  const animateUserMarker = (fullPath) => {
    console.log(fullPath);
    let index = 0;
    const intervalTime = 100; // Time interval for movement (in ms)
    const totalSteps = fullPath.length;
    let stepCount = 0;
    const stepsPerSegment = 25;
    // Move the user marker along the path
    const moveMarkerInterval = setInterval(() => {
      if (index < totalSteps - 1) {
        const currentPosition = fullPath[index];
        const nextPosition = fullPath[index + 1];
        
        // Interpolate between current position and next position
        const latDiff = (nextPosition.lat - currentPosition.lat) / stepsPerSegment;
        const lngDiff = (nextPosition.lng - currentPosition.lng) / stepsPerSegment;
        const newLat = currentPosition.lat + latDiff * stepCount;
        const newLng = currentPosition.lng + lngDiff * stepCount;
        userLocMarker.setPosition(new google.maps.LatLng(newLat, newLng));
        stepCount++;
        if(stepCount >= stepsPerSegment){
          stepCount = 0;
          index++;
        }
      }
      else if(index==totalSteps-1){
        console.log("closed")
        dispatch(setOpenPopup(2));
        dispatch(setMarkerClicked(true));
        userLocMarker.setPosition(new google.maps.LatLng(fullPath[fullPath.length-1].lat, fullPath[fullPath.length-1].lng));
        index++;
      }
      else {
        clearInterval(moveMarkerInterval); // Stop animation once the marker reaches the end
      
      }
    }, intervalTime);
  };

  useEffect(() => {
    if (map && mapCenter) {
      map.setCenter(mapCenter);
      map.setZoom(zoom || 8);
    }
  }, [map, mapCenter, zoom]);

  
  useEffect(() => {
    if (map && center) {
      map.setCenter(center);
      map.setZoom(zoom || 8);
    }
  }, [center]);

  useEffect(() => {
    if (pawsData.user) {
      setCenter({
        lat: parseFloat(pawsData.user.lat),
        lng: parseFloat(pawsData.user.lon),
      });
    }
  }, [pawsData.user]);

  // Update ref value whenever `markerClicked` changes
  useEffect(() => {
    markerClickedRef.current = markerClicked;
  }, [markerClicked]);

    // Call `createClusterer` whenever the map or pawsData changes
    // useEffect(() => {
    //   if (!map) return;
    //   createClusterer(map);
    // }, [pawsData]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={8}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        mapTypeControl: windowWidth > 1024 ? true : false,
        zoomControl: true,
        fullscreenControl: windowWidth > 1024 ? true : false,
        mapTypeControlOptions: {
          position: window.google.maps.ControlPosition.TOP_LEFT,
        },
        streetViewControl: false,
      }}
    >
      {infoWindow.isVisible && (
        <OverlayView
          position={infoWindow.position}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div className={`infoWindowContainer ${infoWindow.class}`}>
            <div className="infoWindowImgBox">
              <img
                src={`data:jpg;base64,${infoWindow.image}`}
                alt="Dog"
                className="infoWindowImg"
              />
            </div>
            <div className="infoWindowContent">
              <p>
                <span>
                  <FontAwesomeIcon
                    className="infoWindowIcon"
                    icon={faCircleUser}
                  />
                </span>
                {" " + infoWindow.name}
              </p>
              <p>
                <span>
                  <FontAwesomeIcon className="infoWindowIcon" icon={faDog} />
                </span>
                {" " + infoWindow.gps}
              </p>
            </div>
          </div>
        </OverlayView>
      )}

      {openPopup === 1 ? (
        <NavigatePopup calculateRoute={calculateRoute} />
      ) : openPopup === 2 ? (
        <FeedPopup />
      ) : openPopup === 3 ? (
        <SuccessPopup status={1} />
      ) : openPopup === 4 ? (
        <SuccessPopup status={2} />
      ) : null}
    </GoogleMap>
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
  );
};

export default MapComponent;
