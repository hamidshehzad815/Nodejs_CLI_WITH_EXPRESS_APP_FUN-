import express from "express";
import { login, signup, profile, updateProfile } from "../Controller/User.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/profile", profile);

router.post("/updateProfile", updateProfile);
export default router;
