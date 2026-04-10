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
import GoogleSuccess from "./components/GoogleSuccess";
import RewriteEditor from "./pages/RewriteEditor";
import DashboardPage from "./pages/DashboardPage"
import History from "./pages/History"

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

  {/* Upload Page */}
  <Route path="/app" element={<ResumeApp />} />

  {/* ATS Results */}
  <Route path="/dashboard" element={<DashboardPage />} />

  {/* AI Rewrite */}
  
  <Route path="/editor" element={<RewriteEditor />} />
  {/* History */}
  <Route path="/history" element={<History />} />

  {/* Google OAuth Callback */}
  <Route path="/google-success" element={<GoogleSuccess />} />
  <Route path="*" element={<NotFound />} />
</Routes>
    </>
  )
}

export default App