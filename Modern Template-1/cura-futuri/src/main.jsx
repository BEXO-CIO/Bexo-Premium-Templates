import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { loadLocalTestProfile } from "./utils/profileHelper";

async function boot() {
  // Prefetch the live profile so the first paint shows real data, but never
  // hold the page hostage: cap the wait and fall back to async hydration.
  await Promise.race([
    loadLocalTestProfile(),
    new Promise((resolve) => setTimeout(resolve, 2500)),
  ]);

  ReactDOM.createRoot(document.getElementById("root")).render(
    <Router>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>,
  );
}

boot();
