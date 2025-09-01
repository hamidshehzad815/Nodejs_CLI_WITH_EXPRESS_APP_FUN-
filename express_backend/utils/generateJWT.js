import jwt from "jsonwebtoken";

export default async function (user) {
  const payload = {
    ...user,
  };
  const option = {
    expiresIn: "1h",
  };

  return jwt.sign(payload, process.env.JWT_SECRET_KEY, option);
}
