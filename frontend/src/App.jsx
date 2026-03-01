import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResumeApp from "./pages/ResumeApp";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  const location = useLocation()

  // Show navbar only on landing page
  const shouldShowNavbar = location.pathname === "/"

  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out", once: true });
  }, []);

  
  return (
    <>
      {shouldShowNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/app" element={<ResumeApp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App