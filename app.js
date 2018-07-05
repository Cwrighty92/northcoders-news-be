const app = require("express")();
const bodyparser = require("body-parser");
const apiRouter = require("./routes/api");
const mongoose = require("mongoose");
const { DB_URL } = require("./config");
const { handle400 } = require("./errorHandlers/error");
app.use(bodyparser.json());

mongoose.connect(
  DB_URL,
  { useNewUrlParser: true }
);

app.get("/", (req, res) => {
  res.status(200).send("All good");
});

app.use("/api", apiRouter);

// app.use("/*", (req, res, next) => {
//   next({ status: 404, message: "Page does not exsist" });
// });

app.use((err, req, res, next) => {
  if (err.message === "No user found with given userName") {
    res.status(404).send({
      message: "Page not found with given userName, it does not exist"
    });
  }
  if (err.message === "Page not found") {
    res.status(404).send({ message: "Page not found for given Id" });
  }
  if (err.name === "CastError") {
    res.status(400).send({
      message: `${err.value} is in an incorrect format Check the ReadMe`
    });
  }
  if (err.name === "ValidationError") {
    res.status(400).send({
      message: `The object provided is not in the correct format please see the readMe for guidance`
    });
  }
});

module.exports = app;
