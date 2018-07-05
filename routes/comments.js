const commentRouter = require("express").Router();
const {
  getAllComments,
  incrementCommentVote,
  deleteComment
} = require("../controllers/comments");

commentRouter.get("/", getAllComments);
commentRouter
  .route("/:comment")
  .put(incrementCommentVote)
  .delete(deleteComment);

module.exports = commentRouter;
