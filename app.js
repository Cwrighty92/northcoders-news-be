const app = require("express")();
const bodyparser = require("body-parser");
const apiRouter = require("./routes/api");
const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL || require("./config").DB_URL;
const handleErrors = require("./errorHandlers/error");
app.use(bodyparser.json());
app.set("view engine", "ejs");

mongoose.connect(
  DB_URL,
  { useNewUrlParser: true }
);
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.status(200).send("Add API onto the URL link to get to the right page");
});
app.use("/api", apiRouter);

app.use(handleErrors);

app.use((err, req, res, next) => {
  res
    .status(500)
    .send({ message: "Server Error, Apologies for the inconvinience" });
});

module.exports = app;
