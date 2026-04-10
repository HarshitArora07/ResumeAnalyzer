import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
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

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match")
    }

    try {
  const API = import.meta.env.VITE_API_BASE;

  const { data } = await axios.post(
    `${API}/api/auth/register`,
    {
      name: formData.name,
      email: formData.email,
      password: formData.password
    }
  );

  console.log("REGISTER RESPONSE:", data);

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
    "Registration failed"
  );
}
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 sm:p-10">

        {/* Heading */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Start improving your resume today
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-center text-red-500 text-sm">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

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
              placeholder="Create a password"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Create Account
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="grow border-t border-gray-300"></div>
            <span className="mx-3 text-gray-500 text-sm">OR</span>
            <div className="grow border-t border-gray-300"></div>
          </div>

          {/* Google Register Button */}
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
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Register