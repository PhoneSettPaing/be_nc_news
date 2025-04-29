const { selectCommentsByArticleId } = require("../models/comments.model");
const { selectArticleById } = require("../models/articles.model");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const pendingArticle = selectArticleById(article_id);
  const pendingComments = selectCommentsByArticleId(article_id);

  Promise.all([pendingComments, pendingArticle])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
