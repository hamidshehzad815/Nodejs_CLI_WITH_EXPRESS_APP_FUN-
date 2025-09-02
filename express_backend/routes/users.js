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
    return res.status(400).send({ msg: "Invalid User", success: false });
  } else {
    try {
      const userExist = await User.findOne({ email });
      if (userExist) {
        return res
          .status(409)
          .send({ msg: "Email already exists", success: false });
      }
      const salt = await bcrypt.genSalt(15);
      user.password = await bcrypt.hash(user.password, salt);
      const result = await User.insertOne(user);
      return res.status(201).send({
        msg: "Signup Successfull ✅",
        user: _.pick(result, ["name", "email"]),
        success: true,
      });
    } catch (err) {
      console.log(err);
      return res.status(400).send({ msg: err.message, success: false });
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
        const token = await generateToken(_.pick(validUser, ["name", "email"]));
        const user = _.pick(validUser, ["email", "name"]);
        user.token = token;
        res.status(200).send({
          msg: "Login Successful ✅",
          success: true,
          user,
        });
      } else {
        res.status(401).send({
          msg: "Invalid email or password",
          success: false,
          user: null,
        });
      }
    } else {
      res.status(401).send({
        msg: "Invalid email or password",
        success: false,
        user: null,
      });
    }
  } catch (err) {
    res
      .status(500)
      .send({ msg: "Something went wrong", success: false, user: null });
  }
});

router.get("/profile", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne(
      { email },
      { projection: { password: 0, _id: 0 } }
    );
    if (user) {
      res.status(200).send({ msg: "✅ User Found ", success: true, user });
    } else {
      res
        .status(404)
        .send({ msg: "❌ No User Found", success: false, user: null });
    }
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .send({ msg: "❌ Something went wrong", success: false, user: null });
  }
});
export default router;
