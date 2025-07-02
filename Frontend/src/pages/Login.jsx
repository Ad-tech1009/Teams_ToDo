import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { toggleTheme } from "../features/themeSlice";
import { loginSuccess } from "../features/authSlice";

const Login = () => {
  // ───────────────────── Redux ─────────────────────
  const mode = useAppSelector((state) => state.theme.mode);
  const darkMode = mode === "dark";
  const dispatch = useAppDispatch();

  // ─────────────────── Router / state ──────────────
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  // ───────────────────── Handlers ───────────────────
  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/api/auth/login", formData);
      dispatch(loginSuccess(res.data.user)); // save user in Redux
      navigate("/", { replace: true }); // go to dashboard
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid email or password";
      setError(msg);
    }
  };

  // ───────────────────── UI ─────────────────────────
  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors ${
        darkMode ? "bg-[#0D1117] text-white" : "bg-[#F5F5F5] text-gray-800"
      }`}
    >
      {/* Theme toggle */}
      <button
        onClick={() => dispatch(toggleTheme())}
        className="absolute top-6 right-6 p-2 cursor-pointer rounded-full hover:bg-white/10"
      >
        <i
          className={`fas ${
            darkMode ? "fa-sun text-yellow-400" : "fa-moon text-gray-600"
          } text-xl`}
        />
      </button>

      <div className="w-full max-w-6xl px-4 py-8 flex flex-col lg:flex-row gap-8 items-center">
        {/* Login form */}
        <div
          className={`w-full max-w-[600px] rounded-2xl p-8 transition-all ${
            darkMode
              ? "bg-gray-800/60 backdrop-blur-sm shadow-xl"
              : "bg-white/90 backdrop-blur-sm shadow-lg"
          }`}
        >
          <h1 className="text-4xl font-bold text-center mb-2">Welcome Back</h1>
          <p
            className={`text-center mb-8 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Let’s get you back in
          </p>

          {error && (
            <p className="text-red-500 text-center font-medium mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <input
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

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Password</label>
              <div className="relative">
                <input
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
                >
                  <i
                    className={`fas ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    } ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                  />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full px-8 py-3 bg-[#FF4500] text-white font-semibold rounded-lg hover:bg-[#ff5e21] transition-colors"
            >
              Log In
            </button>
          </form>

          <p
            className={`pt-6 text-center ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Don’t have an account?{" "}
            <Link to="/signup" className="text-[#FF4500] hover:underline">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Orange Motivational Card */}
        <div className="hidden lg:block w-full max-w-[400px]">
          <div className="bg-[#FF4500] rounded-2xl p-8 h-full flex flex-col justify-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Welcome to Your Workspace
            </h2>
            <p className="text-xl text-white/90 mb-6">
              Stay on top of your responsibilities and unlock your full
              potential. One sign-in away from productivity.
            </p>
            <div className="mt-auto space-y-4">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <i className="fas fa-lock text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-white font-medium">Secure Access</h3>
                  <p className="text-white/80 text-sm">
                    Your data is safe with us
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <i className="fas fa-bolt text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-white font-medium">Fast Onboarding</h3>
                  <p className="text-white/80 text-sm">
                    Start managing in seconds
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <i className="fas fa-sync-alt text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-white font-medium">Seamless Sync</h3>
                  <p className="text-white/80 text-sm">
                    Stay updated across devices
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

export default Login;
