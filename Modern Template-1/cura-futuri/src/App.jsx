import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Menu from "./components/menu/Menu";
import Footer from "./components/footer/Footer";
import ThemeLab from "./components/theme-lab/ThemeLab";

import Home from "./pages/home/Home";
import Portfolio from "./pages/portfolio/Portfolio";
import Contact from "./pages/contact/Contact";
import HireMeRedirect from "./pages/hireme/HireMeRedirect";

function App() {
  const location = useLocation();
  const showFooter = location.pathname !== "/";

  return (
    <>
      <Menu />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route index element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/hire-me" element={<HireMeRedirect />} />
          {/* Legacy redirects */}
          <Route path="/about" element={<Navigate to="/portfolio" replace />} />
          <Route path="/works" element={<Navigate to="/portfolio" replace />} />
          <Route path="/projects/:id" element={<Navigate to="/portfolio" replace />} />
          <Route path="/blog" element={<Navigate to="/" replace />} />
          <Route path="/sample-blog" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      {showFooter && <Footer />}
      {/* Local/dev only — returns null on production atbexo.com */}
      <ThemeLab />
    </>
  );
}

export default App;
