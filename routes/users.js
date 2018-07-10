const usersRouter = require("express").Router();
const { getUser, getAllUsers } = require("../controllers/users");

usersRouter.route("/").get(getAllUsers);
usersRouter.route("/:username").get(getUser);

module.exports = usersRouter;
