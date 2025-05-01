const { selectUsers, checkUser } = require("../models/users.model");

exports.getUsers = (req, res) => {
  return selectUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  console.log(req.params)
  return checkUser(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
