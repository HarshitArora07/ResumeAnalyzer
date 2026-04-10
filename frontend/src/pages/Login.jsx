import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
  const API = import.meta.env.VITE_API_BASE;

  const { data } = await axios.post(
    `${API}/api/auth/login`,
    formData
  );

  console.log("LOGIN RESPONSE:", data);

  // Normalize user data
  let userData = {};

  if (data.user) {
    userData = data.user;
  } else {
    userData = {
      name: data.name,
      email: data.email
    };
  }

  // Validate response
  if (!data.token || !userData?.name) {
    throw new Error("User data missing from server");
  }

  // Store data
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(userData));

  // Redirect
  navigate("/app");

} catch (err) {
  setError(
    err.response?.data?.message ||
    err.message ||
    "Login failed"
  );
}
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 sm:p-10">

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Login to access your dashboard
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="mt-4 text-center text-red-500 text-sm">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.setItem("token", "guest_token")
                localStorage.setItem("user", JSON.stringify({ name: "Guest Mode" }))
                navigate("/app")
              }}
              className="flex-1 bg-white text-gray-700 border-2 border-gray-300 py-3 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition font-semibold shadow-sm"
            >
              Guest Mode
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="grow border-t border-gray-300"></div>
            <span className="mx-3 text-gray-500 text-sm">OR</span>
            <div className="grow border-t border-gray-300"></div>
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            onClick={() => {
              window.location.href = `${import.meta.env.VITE_API_BASE}/api/auth/google`;
            }}
            className="w-full bg-white border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition font-semibold flex items-center justify-center gap-2"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

        </form>

        {/* Bottom Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login