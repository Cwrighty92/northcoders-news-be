const commentRouter = require("express").Router();
const {
  getAllComments,
  voteCommentUpAndDown,
  deleteComment
} = require("../controllers/comments");

commentRouter.get("/", getAllComments);
commentRouter
  .route("/:comment")
  .put(voteCommentUpAndDown)
  .delete(deleteComment);

module.exports = commentRouter;
