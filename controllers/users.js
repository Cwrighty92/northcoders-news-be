const { User } = require("../models/index");

const getAllUsers = (req, res, next) => {
  return User.find()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

//completed tests
const getUser = (req, res, next) => {
  const userId = req.params;
  User.findOne({ username: userId.username })
    .then(user => {
      if (user === null || undefined)
        next({
          status: 404,
          message: `No user found with given userName`
        });
      else res.status(200).send({ user });
    })
    .catch(next);
};

module.exports = { getUser, getAllUsers };
