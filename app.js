const app = require("express")();
const bodyparser = require("body-parser");
const apiRouter = require("./routes/api");
const mongoose = require("mongoose");
const { DB_URL } = require("./config");

app.use(bodyparser.json());

mongoose
  .connect(
    DB_URL,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected!");
  });

//app.use('viewengine', 'ejs');

app.get("/", (req, res) => {
  res.status(200).send("All good");
});

app.use("/api", apiRouter);

module.exports = app;
