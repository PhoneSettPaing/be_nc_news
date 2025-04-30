const { includes } = require("../db/data/test-data/articles");
const {
  selectArticleById,
  selectArticles,
  updateArticleById,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res) => {
  const queryKeys = Object.keys(req.query);

  if (
    queryKeys.includes("sort_by") ||
    queryKeys.includes("order") ||
    queryKeys.length === 0
  ) {
    const { sort_by = "created_at", order = "desc" } = req.query;

    return selectArticles(sort_by, order).then((articles) => {
      res.status(200).send({ articles });
    });
  } else {
    return Promise.reject({ status: 400, msg: "Bad Request!" });
  }
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (!inc_votes) {
    return Promise.reject({ status: 400, msg: "Bad Request!!" });
  }

  return updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
