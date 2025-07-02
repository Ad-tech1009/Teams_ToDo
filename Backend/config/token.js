import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET , { expiresIn: "15m" });

export const createRefreshToken = (payload) =>
  jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: "7d" });
