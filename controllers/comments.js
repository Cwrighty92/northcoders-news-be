const { Comment } = require("../models/");

const getAllComments = (req, res) => {
  Comment.find().then(comments => {
    res.status(200).send({ comments });
  });
};

const incrementCommentVote = (req, res) => {
  const voteInc =
    req.query.vote === "up" ? 1 : req.query.vote === "down" ? -1 : 0;
  Comment.update(
    { _id: req.params.comment },
    { $inc: { votes: voteInc } }
  ).then(meta => {
    res.status(200).send({ msg: "You have voted on a comment", meta });
  });
};

const deleteComment = (req, res) => {
  Comment.deleteOne({ _id: req.params.comment }).then(meta => {
    res.status(200).send({ msg: "Deleted", meta });
  });
};

module.exports = { getAllComments, incrementCommentVote, deleteComment };
