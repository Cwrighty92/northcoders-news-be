const topicsRouter = require("express").Router();
const {
  getAllTopics,
  getAllArticlesByTopic,
  addArticleToTopic
} = require("../controllers/topics");

topicsRouter.route("/").get(getAllTopics);

topicsRouter
  .route("/:topic/articles")
  .get(getAllArticlesByTopic)
  .post(addArticleToTopic);

module.exports = topicsRouter;
