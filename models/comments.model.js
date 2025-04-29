const db = require("../db/connection");

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertCommentByArticleId = (article_id, body) => {
  return db
    .query(
      `INSERT INTO comments (article_id, body, author) VALUES ($1, $2, (SELECT author FROM articles WHERE article_id = $1)) RETURNING *`,
      [article_id, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
