const mongoose = require("mongoose");
const { Topic } = require("../models");
const { Article } = require("../models/");

const getAllTopics = (req, res) => {
  Topic.find().then(topics => {
    res.status(200).send({ topics });
  });
};

const getAllArticlesByTopic = (req, res, next) => {
  Article.find({ belongs_to: req.params.topic })
    .populate("belongs_to", "slug -_id")
    .then(articles => {
      res.status(200).send({ articles });
    });
};

const addArticleToTopic = (req, res) => {
  const { title, created_by, body, belongs_to } = req.body;
  const newArticle = new Article({ title, created_by, body, belongs_to });
  newArticle.save().then(article => {
    res.status(201).send({ msg: "Article posted!", article });
  });
};

module.exports = { getAllTopics, getAllArticlesByTopic, addArticleToTopic };
