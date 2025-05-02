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

exports.deleteCommentWithId = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "comment_id Not Found!" });
      }
    });
};

exports.updateCommentById = (comment_id, inc_votes) => {
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`,
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "comment_id Not Found!" });
      }
      return rows[0];
    });
};
