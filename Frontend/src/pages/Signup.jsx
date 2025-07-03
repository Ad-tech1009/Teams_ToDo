import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

import { useAppDispatch, useAppSelector } from "../app/hooks.js";
import { toggleTheme } from "../features/themeSlice.js";
import { loginSuccess } from "../features/authSlice.js";

const Signup = () => {
  // Redux
  const mode = useAppSelector((state) => state.theme.mode); // 'light' | 'dark'
  const darkMode = mode === "dark";
  const dispatch = useAppDispatch();

  // Router
  const navigate = useNavigate();

  // Local UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const url = import.meta.env.VITE_API_URI

  // Handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const res = await axios.post(
        `${url}/auth/signup`,
        {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );
      dispatch(loginSuccess(res.data.user));
      navigate("/dash");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Signup failed";
      setError(msg);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        darkMode ? "bg-[#0D1117] text-white" : "bg-[#F5F5F5] text-gray-800"
      }`}
    >
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <div className="flex justify-between items-center px-4 py-3">
          <div
            className="text-xl font-bold cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            todo.
          </div>
          <button
            onClick={() => dispatch(toggleTheme())}
            className="cursor-pointer !rounded-button whitespace-nowrap"
          >
            <i
              className={`fas ${
                darkMode ? "fa-sun text-yellow-400" : "fa-moon text-gray-600"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="w-full max-w-6xl px-4 py-8 flex flex-col lg:flex-row gap-8 items-center">
        {/* Form  */}
        <div
          className={`w-full max-w-[600px] rounded-2xl p-8 transition-all duration-300 ${
            darkMode
              ? "bg-gray-800/60 backdrop-blur-sm shadow-xl"
              : "bg-white/90 backdrop-blur-sm shadow-lg"
          }`}
        >
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Create Your Account</h1>
            <p
              className={`text-lg ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Join us and manage your tasks smartly
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="mb-4 text-red-500 text-center font-medium">{error}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Full Name */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-[#FF4500] transition-all duration-300 ${
                    darkMode
                      ? "bg-gray-700/50 placeholder-gray-400 text-white"
                      : "bg-gray-100 placeholder-gray-500 text-gray-900"
                  }`}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className={`w-full px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-[#FF4500] transition-all duration-300 ${
                    darkMode
                      ? "bg-gray-700/50 placeholder-gray-400 text-white"
                      : "bg-gray-100 placeholder-gray-500 text-gray-900"
                  }`}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    className={`w-full px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-[#FF4500] transition-all duration-300 ${
                      darkMode
                        ? "bg-gray-700/50 placeholder-gray-400 text-white"
                        : "bg-gray-100 placeholder-gray-500 text-gray-900"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <i
                      className={`fas ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      } ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                    />
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className={`w-full px-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-[#FF4500] transition-all duration-300 ${
                      darkMode
                        ? "bg-gray-700/50 placeholder-gray-400 text-white"
                        : "bg-gray-100 placeholder-gray-500 text-gray-900"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <i
                      className={`fas ${
                        showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                      } ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-[#FF4500] text-white font-semibold rounded-lg hover:bg-[#ff5e21] transition-all duration-300 cursor-pointer"
              >
                Sign Up
              </button>
              <div className="pt-6 text-center md:text-left">
                <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#FF4500] hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Motivational Card */}
        <div className="hidden lg:block w-full max-w-[400px]">
          <div className="bg-[#FF4500] rounded-2xl p-8 h-full flex flex-col justify-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Plan today, succeed tomorrow
            </h2>
            <p className="text-xl text-white/90 mb-6">
              Join our platform and take control of your tasks with our powerful
              management tools.
            </p>
            <div className="mt-auto space-y-4">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <i className="fas fa-tasks text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-white font-medium">Task Management</h3>
                  <p className="text-white/80 text-sm">
                    Organize and prioritize your work
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <i className="fas fa-chart-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-white font-medium">
                    Performance Tracking
                  </h3>
                  <p className="text-white/80 text-sm">
                    Monitor progress and achievements
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <i className="fas fa-users text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-white font-medium">Team Collaboration</h3>
                  <p className="text-white/80 text-sm">
                    Work together seamlessly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
