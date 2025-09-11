import { validateUser, User } from "../model/user.js";
import bcrypt from "bcrypt";
import _ from "lodash";
import generateToken from "../utils/generateJWT.js";

async function signup(req, res) {
  let { firstName, lastName, dateOfBirth, email, phone, address, password } =
    req.body;

  const user = {};
  const [street, city, state, country, zipCode] = address.split(" ");
  address = { street, city, state, country, zipCode };
  user["personalInfo"] = { firstName, lastName, dateOfBirth };
  user["contactInfo"] = { email, phone, address };
  user["authentication"] = { password };
  console.log(user);
  const isValid = validateUser(user);
  if (isValid.error) {
    return res.status(400).send({ msg: isValid.error.message, success: false });
  } else {
    try {
      const userExist = await User.findOne({
        "contactInfo.email": user.contactInfo.email,
      });
      if (userExist) {
        return res
          .status(409)
          .send({ msg: "Email already exists", success: false });
      }
      const salt = await bcrypt.genSalt(15);
      user.authentication.password = await bcrypt.hash(
        user.authentication.password,
        salt
      );
      const result = await User.insertOne(user);
      return res.status(201).send({
        msg: "Signup Successfull ✅",
        user: _.pick(result, ["name", "email"]),
        success: true,
      });
    } catch (err) {
      console.log(err.message);
      return res
        .status(400)
        .send({ msg: "Something went wrong", success: false });
    }
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ "contactInfo.email": email });
    if (validUser) {
      const validPassword = await bcrypt.compare(
        password,
        validUser.authentication.password
      );
      if (validPassword) {
        const token = await generateToken(
          _.pick(validUser, [
            "personalInfo.firstname",
            "personalInfo.lastname",
            "personalInfo.dateOfBirth",
            "contactInfo.email",
            "contactInfo.phone",
            "contactInfo.address",
          ])
        );
        const user = _.pick(validUser, [
          "personalInfo.firstName",
          "personalInfo.lastName",
          "personalInfo.dateOfBirth",
          "contactInfo.email",
          "contactInfo.phone",
          "contactInfo.address",
        ]);
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
    console.log(err.message);
    res
      .status(500)
      .send({ msg: "Something went wrong", success: false, user: null });
  }
}

async function profile(req, res) {
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
}

async function updateProfile(req, res) {
  try {
    let { firstName, lastName, phone, address } = req.body.updatedProfile;
    if (address) {
      const [street, city, state, country, zipCode] = address.split(" ");
      address = { street, city, state, country, zipCode };
    }
    const result = await User.findOneAndUpdate(
      { "contactInfo.email": req.body.user.contactInfo.email },
      {
        $set: {
          "personalInfo.firstName":
            firstName || req.body.user.personalInfo.firstName,
          "personalInfo.lastName":
            lastName || req.body.user.personalInfo.lastName,
          "contactInfo.phone": phone || req.body.user.contactInfo.phone,
          "contactInfo.address": address || req.body.user.contactInfo.address,
        },
      },
      { new: true }
    );
    const updatedUser = _.pick(result, ["personalInfo", "contactInfo"]);
    console.log(updatedUser);
    return res.status(201).send({
      msg: "User updated successfully",
      success: true,
      updatedUser,
    });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .send({ msg: "Something went wrong", success: false });
  }
}

export { signup, login, profile, updateProfile };
