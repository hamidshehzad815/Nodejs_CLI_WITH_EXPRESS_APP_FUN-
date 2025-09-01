import express from "express";
import { validateUser, User } from "../model/user.js";
import bcrypt from "bcrypt";
import _ from "lodash";
import generateToken from "../utils/generateJWT.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const user = { name: username, email, password };
  const isValid = validateUser(user);
  if (!isValid) {
    res.send({ msg: "Invalid User", success: false });
  } else {
    try {
      const userExist = await User.findOne({ email });
      if (userExist) {
        res.send({ msg: "Email already exists", success: false });
      }
      const salt = await bcrypt.genSalt(15);
      user.password = await bcrypt.hash(user.password, salt);
      const result = await User.insertOne(user);
      res.send({
        msg: "Signup Successfull ✅",
        user: _.pick(result, ["name", "email"]),
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.send({ msg: err.message, success: false });
    }
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (validUser) {
      const validPassword = await bcrypt.compare(password, validUser.password);
      if (validPassword) {
        const token = generateToken(_.pick(validUser, ["name", "email"]));
        const user = _.pick(validUser, ["email", "name"]);
        user.token = token;
        res.send({
          msg: "Login Successful ✅",
          success: true,
          user,
        });
      } else {
        res.send({ msg: "Invalid email or password", success: false });
      }
    } else {
      res.send({ msg: "Invalid email or password", success: false });
    }
  } catch (err) {}
});

export default router;
