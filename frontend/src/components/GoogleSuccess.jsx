import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function GoogleSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");

    if (token && name) {
      const user = { name, email };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); // ✅ FIX

      navigate("/app");
    } else {
      navigate("/login");
    }
  }, [location, navigate]);

  return <p>Logging in...</p>;
}

export default GoogleSuccess;