const apiRouter = require("express").Router();
const topicsRouter = require("./topics");
const articlesRouter = require("./articles");
const commmentsRouter = require("./comments");
const usersRouter = require("./users");

apiRouter.get("/", (req, res, next) => {
  res.render("pages/index");
});

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commmentsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
