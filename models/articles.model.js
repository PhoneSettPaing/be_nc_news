const db = require("../db/connection");
const format = require("pg-format");

  exports.selectArticleById = (article_id, comment_count) => {
    if (comment_count !== undefined) {
      return db
        .query(
          `SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
          [article_id]
        )
        .then(({ rows }) => {
          if (!rows.length) {
            return Promise.reject({ status: 404, msg: "article_id Not Found!" });
          }
          return rows[0];
        });
    } else {
      return db
        .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
          if (!rows.length) {
            return Promise.reject({ status: 404, msg: "article_id Not Found!" });
          }
          return rows[0];
        });
    }
};

exports.selectArticles = (sort_by, order, topic) => {
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

  let queryString =
    "SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments on articles.article_id = comments.article_id ";

  if (!validSort.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad Request!" });
  } else if (topic) {
    queryString +=
      "WHERE topic = %L GROUP BY articles.article_id ORDER BY %I %s;";
    const formattedQuery = format(queryString, topic, sort_by, order);

    return db.query(formattedQuery).then(({ rows }) => {
      return rows;
    });
  } else {
    queryString += "GROUP BY articles.article_id ORDER BY %I %s;";
    const formattedQuery = format(queryString, sort_by, order);

    return db.query(formattedQuery).then(({ rows }) => {
      return rows;
    });
  }
};

exports.updateArticleById = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "article_id Not Found!" });
      }
      return rows[0];
    });
};
