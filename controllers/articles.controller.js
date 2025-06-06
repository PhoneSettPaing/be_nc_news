const {
  selectArticleById,
  selectArticles,
  updateArticleById,
  insertArticle,
  deleteArticleWithId,
} = require("../models/articles.model");
const {
  selectCommentsByArticleId,
  deleteCommentWithId,
} = require("../models/comments.model");
const { checkTopic } = require("../models/topics.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { comment_count } = req.query;

  return selectArticleById(article_id, comment_count)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const {
    sort_by = "created_at",
    order = "desc",
    topic,
    limit = 10,
    p = 1,
  } = req.query;

  const validSort = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  const validOrder = ["asc", "desc"];

  if (!validSort.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by or order !" });
  }

  if (limit < 1 || p < 1) {
    return Promise.reject({
      status: 400,
      msg: "limit and p must be greater than or equal to 1 !",
    });
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
    return Promise.reject({
      status: 400,
      msg: "Missing required field: inc_votes !",
    });
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

  if (
    typeof author !== "string" ||
    typeof title !== "string" ||
    typeof body !== "string" ||
    typeof topic !== "string" ||
    typeof article_img_url !== "string" ||
    !author.trim() ||
    !title.trim() ||
    !body.trim() ||
    !topic.trim() ||
    !article_img_url.trim()
  ) {
    return Promise.reject({
      status: 400,
      msg: "Invalid data type or missing fields!",
    });
  }

  return insertArticle(author, title, body, topic, article_img_url)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectCommentsByArticleId(article_id)
    .then((comments) => {
      const deleteComments = comments.map((comment) =>
        deleteCommentWithId(comment.comment_id)
      );

      return Promise.all(deleteComments);
    })
    .then(() => {
      return deleteArticleWithId(article_id);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
