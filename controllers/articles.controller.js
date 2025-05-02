const {
  selectArticleById,
  selectArticles,
  updateArticleById,
  insertArticle,
} = require("../models/articles.model");
const { checkTopic } = require("../models/topics.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { comment_count } = req.query;

  if (
    Object.keys(req.query).length === 0 ||
    Object.keys(req.query).includes("comment_count")
  ) {
    return selectArticleById(article_id, comment_count)
      .then((article) => {
        res.status(200).send({ article });
      })
      .catch(next);
  } else {
    return Promise.reject({ status: 400, msg: "Bad Request!" });
  }
};

exports.getArticles = (req, res, next) => {
  const queryKeys = Object.keys(req.query);

  if (
    queryKeys.includes("sort_by") ||
    queryKeys.includes("order") ||
    queryKeys.includes("topic") ||
    queryKeys.length === 0
  ) {
    const { sort_by = "created_at", order = "desc", topic } = req.query;

    if (topic) {
      const pendingTopicCheck = checkTopic(topic);
      const pendingArticles = selectArticles(sort_by, order, topic);

      Promise.all([pendingArticles, pendingTopicCheck])
        .then(([articles]) => {
          res.status(200).send({ articles });
        })
        .catch(next);
    } else {
      return selectArticles(sort_by, order)
        .then((articles) => {
          res.status(200).send({ articles });
        })
        .catch(next);
    }
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

exports.postArticle = (req, res, next) => {

  return insertArticle(req.body)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};
