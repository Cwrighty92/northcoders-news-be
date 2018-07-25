const app = require("express")();
const bodyparser = require("body-parser");
const apiRouter = require("./routes/api");
const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL || require("./config").DB_URL;
const handleErrors = require("./errorHandlers/error");
const cors = require("cors");
app.use(cors());
app.use(bodyparser.json());
app.set("view engine", "ejs");

mongoose.connect(
  DB_URL,
  { useNewUrlParser: true }
);
app.get("/", (req, res) => {
  res.status(200).send("Add API onto the URL link to get to the right page");
});
app.use("/api", apiRouter);

app.use(handleErrors);

module.exports = app;
