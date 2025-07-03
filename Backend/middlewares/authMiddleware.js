import jwt from "jsonwebtoken";
import { refreshAccessToken } from "../controllers/authController.js";

export const requireAuth = (req, res, next) => {
  next(); // Allow all requests to pass through for now
  // const token = req.cookies.accessToken;
  // // console.log("Access token:", token);
  // if (!token) {
  //   // If no access token, try to refresh it
  //   return refreshAccessToken(req, res);
  // }

  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET || "accesskey");
  //   req.user = decoded;
  //   next();
  // } catch (err) {
  //   return res.status(403).json({ message: "Invalid or expired access token" });
  // }
};
