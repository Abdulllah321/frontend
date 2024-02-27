import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AnimatePresence } from "framer-motion";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <AnimatePresence mode="wait">
      <GoogleOAuthProvider clientId="460327352776-4rohri9ob3ucgc0deeqfl06dl1l3lvoa.apps.googleusercontent.com">
        <Provider store={store}>
          <App />
        </Provider>
      </GoogleOAuthProvider>
    </AnimatePresence>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
