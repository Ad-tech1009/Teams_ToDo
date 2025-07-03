import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { toggleTheme } from "../features/themeSlice";
import { loginSuccess } from "../features/authSlice";

const Login = () => {
  const mode = useAppSelector((state) => state.theme.mode);
  const darkMode = mode === "dark";
  const dispatch = useAppDispatch();
  const url = import.meta.env.VITE_API_URI;

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${url}/auth/login`, formData);
      dispatch(loginSuccess(res.data.user));
      navigate("/dash");
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid email or password";
      setError(msg);
    } finally {
      setLoading(false);
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
              Welcome Back
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">
              Let’s get you back in
            </p>
          </div>

          {error && (
            <p className="mb-4 text-red-500 text-center font-medium">{error}</p>
          )}

          {loading && (
            <p className="mb-4 text-center text-sm font-medium text-blue-500 animate-pulse">
              Logging in, please wait...
            </p>
          )}

          <form onSubmit={handleSubmit} className="grid gap-6">
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
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#FF4500] ${
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
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#FF4500] ${
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

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-3 bg-[#FF4500] text-white font-semibold rounded-lg hover:bg-[#ff5e21] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Log In
            </button>
          </form>

          <p
            className={`pt-6 text-center ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Don’t have an account?{' '}
            <Link to="/signup" className="text-[#FF4500] hover:underline">
              Sign Up
            </Link>
          </p>
        </section>

        <aside className="w-full sm:max-w-md lg:w-5/12 h-full">
          <div className="bg-[#FF4500] rounded-2xl p-8 h-full flex flex-col justify-center gap-6 text-white shadow-xl">
            <h2 className="text-3xl font-bold leading-snug">
              Welcome to Your Workspace
            </h2>
            <p className="text-lg/relaxed opacity-90">
              Stay on top of your responsibilities and unlock your full potential. One sign-in away from productivity.
            </p>
            <ul className="space-y-4 mt-auto">
              <li className="flex items-start space-x-4">
                <span className="bg-white/20 p-3 rounded-full"><i className="fas fa-lock text-xl" /></span>
                <span>
                  <h3 className="font-medium">Secure Access</h3>
                  <p className="text-sm opacity-80">Your data is safe with us</p>
                </span>
              </li>
              <li className="flex items-start space-x-4">
                <span className="bg-white/20 p-3 rounded-full"><i className="fas fa-bolt text-xl" /></span>
                <span>
                  <h3 className="font-medium">Fast Onboarding</h3>
                  <p className="text-sm opacity-80">Start managing in seconds</p>
                </span>
              </li>
              <li className="flex items-start space-x-4">
                <span className="bg-white/20 p-3 rounded-full"><i className="fas fa-sync-alt text-xl" /></span>
                <span>
                  <h3 className="font-medium">Seamless Sync</h3>
                  <p className="text-sm opacity-80">Stay updated across devices</p>
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Login;
