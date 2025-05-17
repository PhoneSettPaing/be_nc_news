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
  const {
    sort_by = "created_at",
    order = "desc",
    topic,
    limit = 10,
    p = 1,
  } = req.query;

  if (limit < 1 || p < 1) {
    return Promise.reject({ status: 400, msg: "Bad Request!" });
  }

  const restrictMaxLimit = Math.min(limit, 100);
  const offset = limit * (p - 1);

  if (topic) {
    const pendingTopicCheck = checkTopic(topic);
    const pendingArticles = selectArticles(
      sort_by,
      order,
      topic,
      restrictMaxLimit,
      offset
    );

    Promise.all([pendingArticles, pendingTopicCheck])
      .then(([result]) => {
        res.status(200).send(result);
      })
      .catch(next);
  } else {
    return selectArticles(sort_by, order, topic, restrictMaxLimit, offset)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch(next);
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
  const {
    author,
    title,
    body,
    topic,
    article_img_url = "http://www.gravatar.com/avatar/?d=mp",
  } = req.body;

  return insertArticle(author, title, body, topic, article_img_url)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};
