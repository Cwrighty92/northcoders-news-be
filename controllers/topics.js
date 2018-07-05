const mongoose = require("mongoose");
const { Topic } = require("../models");
const { Article } = require("../models/");

const getAllTopics = (req, res, next) => {
  return Topic.find()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

const getAllArticlesByTopic = (req, res, next) => {
  return Article.find({ belongs_to: req.params.topic })
    .populate("belongs_to", "slug -_id")
    .then(articles => {
      if (articles.length === 0) {
        next({ status: 404, message: "Page not found" });
      } else res.status(200).send({ articles });
    })
    .catch(next);
};

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
