const usersRouter = require("express").Router();
const getUser = require("../controllers/users");
usersRouter.route("/").get((req, res, next) => {
  res.send("Users Page try inputting a username to get a users profile");
});
usersRouter.route("/:username").get(getUser);

module.exports = usersRouter;
