const mongoose = require("mongoose");
const { Comment } = require("../models/");
const { Article } = require("../models/");

//completed tests
const getAllArticles = (req, res, next) => {
  Article.find()
    .populate("created_by", "username -_id")
    .lean()
    .then(articles => {
      const commentCounts = articles.map(article => {
        return Comment.count({ belongs_to: article._id });
      });
      commentCounts.push(articles);
      return Promise.all(commentCounts);
    })
    .then(commentCounts => {
      const articlesWithoutComment = commentCounts.pop();
      const articles = articlesWithoutComment.map(article => {
        const { created_by } = article;
        const editedArticle = {
          ...article,
          commentCount: commentCounts.shift()
        };
        return editedArticle;
      });
      res.send({ articles });
    })
    .catch(next);
};
//completed tests
const getCommentsInArticle = (req, res, next) => {
  Comment.find({ belongs_to: req.params.article })
    .populate("created_by", "username -_id")
    .populate("belongs_to", "title -_id")
    .then(comments => {
      if (comments.length === 0) {
        console.log(comments);
        next({ status: 404, message: "Page not found" });
      } else res.status(200).send({ comments });
    })
    .catch(next);
};

//completed tests
const addCommentToArticle = (req, res, next) => {
  const { created_by, body, belongs_to } = req.body;
  const newComment = new Comment({ created_by, body, belongs_to });
  Comment.create(newComment)
    .then(comment => {
      res.status(201).send({ msg: "Your Comment has been posted", comment });
    })
    .catch(next);
};

//completed tests
const upVoteAndDownVote = (req, res, next) => {
  if (req.query.vote === "up" || req.query.vote === "down") {
    const voteInc =
      req.query.vote === "up" ? 1 : req.query.vote === "down" ? -1 : -1;
    Article.update({ _id: req.params.article }, { $inc: { votes: voteInc } })
      .then(article => {
        res.status(200).send({ msg: "You have added a vote", article });
      })
      .catch(next);
  } else
    next({
      status: 400,
      message: "Bad request: Only takes up or down query to make a vote "
    });
};

// get article - working needs testing
const getArticle = (req, res, next) => {
  console.log(req.params);
  const articleId = req.params;
  console.log(articleId.article);
  Article.findOne({ _id: articleId.article })
    .then(user => {
      if (user === null || undefined)
        next({
          status: 404,
          message: `No user found with given userName`
        });
      else res.status(200).send({ user });
    })
    .catch(next);
};

module.exports = {
  getAllArticles,
  getCommentsInArticle,
  addCommentToArticle,
  upVoteAndDownVote,
  getArticle
};
