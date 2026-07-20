import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { loadLocalTestProfile } from "./utils/profileHelper";

async function boot() {
  await Promise.race([
    loadLocalTestProfile(),
    new Promise((resolve) => setTimeout(resolve, 2500)),
  ]);

  ReactDOM.createRoot(document.getElementById("root")).render(
    <Router basename={window.__BEXO_BASE_PATH__ || "/"}>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>,
  );

  const loader = document.getElementById("boot-loader");
  if (loader) {
    loader.classList.add("is-done");
    setTimeout(() => loader.remove(), 500);
  }
}

boot();
