import express from "express";
import users from "../routes/users.js";

const routes = (app) => {
  app.use(express.json());
  app.use("/users", users);
};

export default routes;
