const handleErrors = (err, req, res, next) => {
  if (
    err.message ===
    "Either there are no comments in this article or the article id is invalid"
  ) {
    res.status(404).send({
      message:
        "Either there are no comments in this article or the article id is invalid"
    });
  }
  if (
    err.message === "Bad request: Only takes up or down query to make a vote "
  ) {
    res.status(400).send({
      message: "Bad request: Only takes up or down query to make a vote"
    });
  }
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
      message: `${
        err.value
      } is in an incorrect format or does not exist Check the ReadMe`
    });
  }
  if (err.name === "ValidationError") {
    res.status(400).send({
      message: `The object provided is not in the correct format please see the readMe for guidance`
    });
  }
};

module.exports = handleErrors;
