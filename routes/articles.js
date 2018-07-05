const articleRouter = require("express").Router();
const {
  getAllArticles,
  getCommentsInArticle,
  addCommentToArticle,
  incrementArticleVote
} = require("../controllers/articles");

articleRouter.route("/").get(getAllArticles);

articleRouter.route("/:article").put(incrementArticleVote);

articleRouter
  .route("/:article/comments")
  .get(getCommentsInArticle)
  .post(addCommentToArticle);

module.exports = articleRouter;
