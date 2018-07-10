const app = require("../app");

const handleErrors = (err, req, res, next) => {
  if (
    err.message ===
    "Either there are no comments in this article or the article id is invalid"
  ) {
    res.status(404).send({
      message:
        "Either there are no comments in this article or the article id is invalid"
    });
  } else if (
    err.message === "Bad request: Only takes up or down query to make a vote "
  ) {
    res.status(400).send({
      message: "Bad request: Only takes up or down query to make a vote"
    });
  } else if (err.message === "No user found with given userName") {
    res.status(404).send({
      message: "Page not found with given userName, it does not exist"
    });
  } else if (err.message === "No article found with given article ID") {
    res.status(404).send({
      message: "Page not found with given article ID, it does not exist"
    });
  } else if (err.message === "Page not found") {
    res.status(404).send({ message: "Page not found for given Id" });
  } else if (err.name === "CastError") {
    res.status(400).send({
      message: `${
        err.value
      } is in an incorrect format or does not exist Check the ReadMe`
    });
  } else if (err.name === "ValidationError") {
    res.status(400).send({
      message: `The object provided is not in the correct format please see the readMe for guidance`
    });
  } else
    (err, req, res, next) => {
      res.status(500).send({
        message: "Server Error, Apologies for the inconvinience"
      });
    };
};

module.exports = handleErrors;
