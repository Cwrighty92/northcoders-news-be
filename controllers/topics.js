const mongoose = require("mongoose");
const { Topic } = require("../models");
const { Article } = require("../models");
const { Comment } = require("../models");

//completed tests
const getAllTopics = (req, res, next) => {
  return Topic.find()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

//completed tests
const getAllArticlesByTopic = (req, res, next) => {
  Article.find({ belongs_to: req.params.topic })
    .populate("belongs_to", "slug -_id")
    .populate("created_by", "username -_id")
    .then(articles => {
      if (articles.length === 0) {
        next({ status: 404, message: "Page not found" });
      } else {
        const commentCounts = articles.map(article => {
          return Comment.countDocuments({ belongs_to: article._id });
        });
        commentCounts.push(articles);
        return Promise.all(commentCounts);
      }
    })
    .then(commentCounts => {
      const articlesOnOwn = commentCounts.pop();
      const articles = articlesOnOwn.map(article => {
        const articleWithComment = {
          ...article._doc,
          comment_count: commentCounts.shift()
        };

        return articleWithComment;
      });
      res.send({ articles });
    })
    .catch(next);
};

//completed tests
const addArticleToTopic = (req, res, next) => {
  const newArticle = new Article(req.body);
  newArticle.belongs_to = req.params.topic;
  Article.create(newArticle)
    .then(() => {
      res
        .status(201)
        .send({ message: "You have added a new Article", newArticle });
    })
    .catch(next);
};

module.exports = { getAllTopics, getAllArticlesByTopic, addArticleToTopic };
