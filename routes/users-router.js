const usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUsername,
} = require("../controllers/users.controller");

usersRouter.get("/", getUsers);

usersRouter.route("/:username").get(getUserByUsername);

module.exports = usersRouter;
