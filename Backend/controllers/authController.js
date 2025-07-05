import User from "../models/userSchema.js";
import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken } from "../config/token.js";
import jwt from "jsonwebtoken";

// route: POST /auth/signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const newUser = new User({ name, email, password });
    await newUser.save();

    const payload = { userId: newUser._id };
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000, 
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      })
      .status(201)
      .json({
        message: "Signup successful",
        user: { id: newUser._id, name: newUser.name, email: newUser.email },
      });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// route: POST /auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: "Invalid credentials" });

    const payload = { userId: user._id };
    const accessToken = createAccessToken(payload);
    const refreshToken = createRefreshToken(payload);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Login successful",
        user: { id: user._id, name: user.name, email: user.email },
      });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// route: GET /auth/refresh
export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "Refresh token missing" });
  // console.log("Refresh token:", refreshToken);
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    // console.log("Decoded refresh token:", decoded);
    const newAccessToken = createAccessToken({ userId: decoded.userId });

    res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
      })
      .status(200)
      .json({ message: "Access token refreshed" });

  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

// route: GET /auth/logout
export const logout = (req, res) => {
  res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json({ message: "Logged out successfully" });
};
