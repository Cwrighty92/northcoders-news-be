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
        return Comment.countDocuments({ belongs_to: article._id });
      });

      // commentCounts.push(articles);
      return Promise.all([articles, ...commentCounts]);
    })
    .then(([articles, ...commentCounts]) => {
      // const articlesWithoutComment = commentCounts.pop();
      const newarticles = articles.map((article, i) => {
        // const { created_by } = article;
        const editedArticle = {
          ...article,
          commentCount: commentCounts[i]
        };
        return editedArticle;
      });

      res.send({ articles: newarticles });
    })
    .catch(next);
};

// completed tests
const getArticle = (req, res, next) => {
  const articleId = req.params;
  Article.findOne({ _id: articleId.article })
    .populate("belongs_to", "slug -_id")
    .populate("created_by", "username")
    .then(article => {
      if (article === null || undefined)
        next({
          status: 404,
          message: `No article found with given article ID`
        });
      else
        return Promise.all([
          article,
          Comment.countDocuments({ belongs_to: article._id })
        ]);
    })
    .then(([article, commentCount]) => {
      article = { ...article._doc, commentCount: commentCount };
      res.send({ article });
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

module.exports = {
  getAllArticles,
  getCommentsInArticle,
  addCommentToArticle,
  upVoteAndDownVote,
  getArticle
};
