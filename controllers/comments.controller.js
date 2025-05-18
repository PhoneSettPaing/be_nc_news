const {
  selectCommentsByArticleId,
  insertCommentByArticleId,
  deleteCommentWithId,
  updateCommentById,
} = require("../models/comments.model");
const { selectArticleById } = require("../models/articles.model");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { limit = 10, p = 1 } = req.query;

  if (limit < 1 || p < 1) {
    return Promise.reject({
      status: 400,
      msg: "limit and p must be greater than or equal to 1 !",
    });
  }

  const restrictMaxLimit = Math.min(limit, 100);
  const offset = limit * (p - 1);

  const pendingArticle = selectArticleById(article_id);
  const pendingComments = selectCommentsByArticleId(
    article_id,
    restrictMaxLimit,
    offset
  );

  Promise.all([pendingComments, pendingArticle])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;

  if (
    typeof username !== "string" ||
    typeof body !== "string" ||
    !username.trim() ||
    !body.trim()
  ) {
    return Promise.reject({
      status: 400,
      msg: "Invalid data type or missing username and/or body!",
    });
  }

  return insertCommentByArticleId(article_id, body, username)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  return deleteCommentWithId(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Missing required field: inc_votes !",
    });
  }

  return updateCommentById(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
