const articleRouter = require("express").Router();
const {
  getAllArticles,
  getCommentsInArticle,
  addCommentToArticle,
  upVoteAndDownVote,
  getArticle
} = require("../controllers/articles");

articleRouter.route("/").get(getAllArticles);

articleRouter
  .route("/:article")
  .put(upVoteAndDownVote)
  .get(getArticle);

articleRouter
  .route("/:article/comments")
  .get(getCommentsInArticle)
  .post(addCommentToArticle);

module.exports = articleRouter;
