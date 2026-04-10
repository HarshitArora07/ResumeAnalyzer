import { useEffect } from "react";

function GoogleSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");

    if (token && name) {
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({ name, email })
      );

      // ✅ safer for OAuth redirect flow
      window.location.replace("/app");
    } else {
      window.location.replace("/login");
    }
  }, []);

  return <p>Logging you in...</p>;
}

export default GoogleSuccess;