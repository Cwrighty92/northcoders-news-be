const data = require("./devData/dataLinks");
const mongoose = require("mongoose");
const { DB_URL } = require("../config");
const seedDB = require("./seed");

mongoose
  .connect(
    DB_URL,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log(`Begining Seed to ${DB_URL}`);
  })
  .then(() => seedDB(data.topics, data.users, data.articles, data.comments))
  .then(() => {
    console.log("Seed Successfully done");
  })
  .then(() => mongoose.disconnect());
