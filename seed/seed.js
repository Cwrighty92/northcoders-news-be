const mongoose = require("mongoose");
const { Article, Comment, Topic, User } = require("../models");
const {
  createRefObject,
  editArticleData,
  editCommentData
} = require("../utils");

const seedDB = (topicData, userData, articleData, commentData) => {
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      return Promise.all([
        Topic.insertMany(topicData),
        User.insertMany(userData)
      ]);
    })
    .then(([topicIdDocs, userIdDocs]) => {
      const topicLookUpObject = createRefObject(topicIdDocs, "slug");
      const userLookUpObject = createRefObject(userIdDocs, "username");
      return Promise.all([
        Article.insertMany(
          editArticleData(topicLookUpObject, userLookUpObject, articleData)
        ),
        topicIdDocs,
        userIdDocs,
        topicLookUpObject,
        userLookUpObject
      ]);
    })
    .then(
      ([
        articleIdDocs,
        topicIdDocs,
        userIdDocs,
        topicLookUpObject,
        userLookUpObject
      ]) => {
        const articleLookUpObject = createRefObject(articleIdDocs, "title");
        return Promise.all([
          Comment.insertMany(
            editCommentData(articleLookUpObject, userLookUpObject, commentData)
          ),
          topicIdDocs,
          userIdDocs,
          articleIdDocs
        ]);
      }
    )
    .catch(console.log);
};

module.exports = seedDB;
