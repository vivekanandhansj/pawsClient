import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "material-icons/iconfont/material-icons.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Provider } from "react-redux";
import store from "./redux/store.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
