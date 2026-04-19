import { useCallback, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer/Footer";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const goToSection = useCallback((id, behavior = "smooth") => {
    const element = document.getElementById(id);
    if (!element) return false;

    const navbarHeight = window.innerWidth <= 768 ? 110 : 0.15 * window.innerHeight;

    window.scrollTo({
      top: element.offsetTop - navbarHeight,
      behavior,
    });

    return true;
  }, []);

  const navigateToSection = useCallback(
    id => {
      navigate(`/#${id}`);

      if (location.pathname === "/") {
        goToSection(id);
      }
    },
    [goToSection, location.pathname, navigate]
  );

  useEffect(() => {
    if (location.pathname !== "/" || !location.hash) return;

    const sectionId = location.hash.slice(1);
    let attempts = 0;
    const maxAttempts = 20;

    const intervalId = setInterval(() => {
      attempts += 1;
      const didScroll = goToSection(sectionId);
      if (didScroll || attempts >= maxAttempts) {
        clearInterval(intervalId);
      }
    }, 120);

    return () => clearInterval(intervalId);
  }, [goToSection, location.hash, location.pathname]);

  return (
    <>
      <Navbar navigateToSection={navigateToSection} />
      <Routes>
        <Route path="/" element={<HomePage navigateToSection={navigateToSection} />} />
      </Routes>
      <Footer navigateToSection={navigateToSection} />
    </>
  );
}

export default App;
