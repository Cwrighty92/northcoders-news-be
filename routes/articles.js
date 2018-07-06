const articleRouter = require("express").Router();
const {
  getAllArticles,
  getCommentsInArticle,
  addCommentToArticle,
  upVoteAndDownVote
} = require("../controllers/articles");

articleRouter.route("/").get(getAllArticles);

articleRouter.route("/:article").put(upVoteAndDownVote);

articleRouter
  .route("/:article/comments")
  .get(getCommentsInArticle)
  .post(addCommentToArticle);

module.exports = articleRouter;
