const mongoose = require("mongoose");
const { Topic } = require("../models");
const { Article } = require("../models/");

const getAllTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

const getAllArticlesByTopic = (req, res, next) => {
  Article.find({ belongs_to: req.params.topic })
    .populate("belongs_to", "slug -_id")
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

const addArticleToTopic = (req, res, next) => {
  const { title, created_by, body, belongs_to } = req.body;
  const newArticle = new Article({ title, created_by, body, belongs_to });
  newArticle
    .save()
    .then(article => {
      res.status(201).send({ msg: "Article posted!", article });
    })
    .catch(next);
};

module.exports = { getAllTopics, getAllArticlesByTopic, addArticleToTopic };
