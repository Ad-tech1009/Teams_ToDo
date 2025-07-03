import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";

import { useAppDispatch, useAppSelector } from "../app/hooks.js";
import { toggleTheme } from "../features/themeSlice.js";
import { loginSuccess } from "../features/authSlice.js";

const Signup = () => {
  const mode = useAppSelector((state) => state.theme.mode);
  const darkMode = mode === "dark";
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const url = import.meta.env.VITE_API_URI;

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
        // { withCredentials: true }
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
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#0D1117] text-white" : "bg-[#F5F5F5] text-gray-800"
      }`}
    >
      {/* Header */}
      <nav className="w-full py-4 flex items-center justify-between px-4 border-b border-gray-300 dark:border-gray-700">
        <h1
          className="text-2xl font-bold cursor-pointer select-none"
          onClick={() => navigate("/")}
        >
          todo.
        </h1>
        <button
          onClick={() => dispatch(toggleTheme())}
          className="grid place-items-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          aria-label="Toggle dark mode"
        >
          <i
            className={`fas ${
              darkMode ? "fa-sun text-yellow-400" : "fa-moon text-gray-700"
            }`}
          />
        </button>
      </nav>

      {/* Main */}
      <main className="container mx-auto px-4 pt-10 pb-12 flex flex-col lg:flex-row gap-12 items-center">
        {/* Form */}
        <section
          className={`w-full lg:w-7/12 max-w-xl rounded-2xl p-8 shadow-lg backdrop-blur-sm transition-all duration-300 ${
            darkMode ? "bg-gray-800/60" : "bg-white/90"
          }`}
        >
          <div className="mb-8 text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Create Your Account
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
              Join us and manage your tasks smartly
            </p>
          </div>

          {error && (
            <p className="mb-4 text-red-500 text-center font-medium">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
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

            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input
                id="email"
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

            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
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
                  aria-label="Toggle password visibility"
                >
                  <i
                    className={`fas ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    } ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                  />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
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
                  aria-label="Toggle confirm password visibility"
                >
                  <i
                    className={`fas ${
                      showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                    } ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                  />
                </button>
              </div>
            </div>

            <div className="space-y-6 md:space-y-0 md:flex md:items-center md:justify-between">
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-[#FF4500] text-white font-semibold rounded-lg hover:bg-[#ff5e21] transition-colors"
              >
                Sign Up
              </button>
              <p className="text-center md:text-left text-gray-700 dark:text-gray-300">
                Already have an account?{' '}
                <Link to="/login" className="text-[#FF4500] hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </section>

        <aside className="w-full sm:max-w-md lg:w-5/12 h-full">
          <div className="bg-[#FF4500] rounded-2xl p-8 h-full flex flex-col justify-center gap-6 text-white shadow-xl">
            <h2 className="text-3xl font-bold leading-snug">
              Plan today, succeed tomorrow
            </h2>
            <p className="text-lg/relaxed opacity-90">
              Join our platform and take control of your tasks with our powerful management tools.
            </p>
            <ul className="space-y-4 mt-auto">
              <li className="flex items-start space-x-4">
                <span className="bg-white/20 p-3 rounded-full"><i className="fas fa-tasks text-xl" /></span>
                <span>
                  <h3 className="font-medium">Task Management</h3>
                  <p className="text-sm opacity-80">Organize and prioritize your work</p>
                </span>
              </li>
              <li className="flex items-start space-x-4">
                <span className="bg-white/20 p-3 rounded-full"><i className="fas fa-chart-line text-xl" /></span>
                <span>
                  <h3 className="font-medium">Performance Tracking</h3>
                  <p className="text-sm opacity-80">Monitor progress and achievements</p>
                </span>
              </li>
              <li className="flex items-start space-x-4">
                <span className="bg-white/20 p-3 rounded-full"><i className="fas fa-users text-xl" /></span>
                <span>
                  <h3 className="font-medium">Team Collaboration</h3>
                  <p className="text-sm opacity-80">Work together seamlessly</p>
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Signup;
