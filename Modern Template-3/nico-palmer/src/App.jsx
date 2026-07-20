import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import Menu from "./components/Menu/Menu";
import ThemeLab from "./components/ThemeLab/ThemeLab";

import Home from "./pages/Home/Home";
import Portfolio from "./pages/Portfolio/Portfolio";
import Project from "./pages/Project/Project";
import Contact from "./pages/Contact/Contact";
import HireMeRedirect from "./pages/HireMe/HireMeRedirect";

import { useDisplayProfile } from "./utils/profileHelper";

import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => window.scrollTo(0, 0), 900);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

function DocumentTitle() {
  const { user } = useDisplayProfile();
  useEffect(() => {
    document.title = user?.name ? `${user.name} | Portfolio` : "Portfolio";
  }, [user?.name]);
  return null;
}

function App() {
  const location = useLocation();
  const { projectEntries } = useDisplayProfile();
  const hasWork = (projectEntries?.length || 0) > 0;

  return (
    <>
      <ScrollToTop />
      <DocumentTitle />
      <Menu />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route index element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/hire-me" element={<HireMeRedirect />} />
          <Route
            path="/project/:id"
            element={hasWork ? <Project /> : <Navigate to="/" replace />}
          />
          {/* Legacy routes from the original cinematic template */}
          <Route path="/work" element={<Navigate to="/portfolio" replace />} />
          <Route path="/about" element={<Navigate to="/portfolio" replace />} />
          <Route path="/faq" element={<Navigate to="/contact" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <ThemeLab />
    </>
  );
}

export default App;
