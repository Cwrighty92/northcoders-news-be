const mongoose = require("mongoose");
const { Comment } = require("../models/");
const { Article } = require("../models/");

const getAllArticles = (req, res) => {
  Article.find().then(articles => {
    res.status(200).send({ articles });
  });
};

const getCommentsInArticle = (req, res) => {
  Comment.find({ belongs_to: req.params.article })
    .populate("belongs_to", "title -_id")
    .then(comments => {
      res.status(200).send({ comments });
    });
};

const addCommentToArticle = (req, res) => {
  const { created_by, body, belongs_to } = req.body;
  const newComment = new Comment({ created_by, body, belongs_to });
  newComment.save().then(comment => {
    res.status(201).send({ msg: "Your Comment has been posted", comment });
  });
};

const incrementArticleVote = (req, res) => {
  const voteInc =
    req.query.vote === "up" ? +1 : req.query.vote === "down" ? -1 : 0;
  Article.update(
    { _id: req.params.article },
    { $inc: { votes: voteInc } }
  ).then(article => {
    res.status(200).send({ msg: "You have added a vote", article });
  });
};

module.exports = {
  getAllArticles,
  getCommentsInArticle,
  addCommentToArticle,
  incrementArticleVote
};
