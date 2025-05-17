const { selectTopics, insertTopic } = require("../models/topics.model");

exports.getTopics = (req, res) => {
  return selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body;

  if (typeof slug !== "string" || typeof description !== "string") {
    return Promise.reject({ status: 400, msg: "Bad Request!" });
  }

  return insertTopic(slug, description)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
