import express from "express";
import {
  login,
  signup,
  profile,
  updateProfile,
  resetPassword,
  forgetPassword,
  validateToken,
} from "../Controller/User.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/profile", profile);

router.post("/updateProfile", updateProfile);

router.post("/forgetPassword", forgetPassword);

router.post("/validateToken", validateToken);

router.post("/resetPassword", resetPassword);
export default router;
