const data = require("./devData/dataLinks");
const mongoose = require("mongoose");
const { DB_URL } = require("../config");
console.log(DB_URL);
const seedDB = require("./seed");

mongoose
  .connect(
    DB_URL,
    { useNewUrlParser: true }
  )
  .then(() => seedDB(data.topics, data.users, data.articles, data.comments))
  .then(() => mongoose.disconnect());
