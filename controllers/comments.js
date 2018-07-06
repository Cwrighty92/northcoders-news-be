const { Comment } = require("../models/");

//completed tests
const getAllComments = (req, res, next) => {
  Comment.find()
    .populate("belongs_to")
    .populate("created_by")
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

//completed tests
const voteCommentUpAndDown = (req, res, next) => {
  if (req.query.vote === "up" || req.query.vote === "down") {
    const voteInc =
      req.query.vote === "up" ? 1 : req.query.vote === "down" ? -1 : 0;
    Comment.update({ _id: req.params.comment }, { $inc: { votes: voteInc } })
      .then(comment => {
        res.status(200).send({ msg: "You have voted on a comment", comment });
      })
      .catch(next);
  } else
    next({
      status: 400,
      message: "Bad request: Only takes up or down query to make a vote "
    });
};
//completed tests
const deleteComment = (req, res, next) => {
  Comment.findByIdAndRemove(req.params.comment)
    .then(() => {
      res.status(204).send({ msg: "You have deleted" });
    })
    .catch(next);
};

module.exports = { getAllComments, voteCommentUpAndDown, deleteComment };
