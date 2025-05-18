const db = require("../db/connection");
const format = require("pg-format");

exports.selectArticleById = (article_id, comment_count) => {
  if (comment_count !== undefined) {
    return db
      .query(
        `SELECT a.*, COUNT(c.comment_id)::INT AS comment_count FROM articles a LEFT JOIN comments c ON a.article_id = c.article_id WHERE a.article_id = $1 GROUP BY a.article_id;`,
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

exports.selectArticles = (sort_by, order, topic, restrictMaxLimit, offset) => {
  const selectQuery =
    "SELECT a.article_id, a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id)::INT AS comment_count FROM articles a LEFT JOIN comments c on a.article_id = c.article_id ";
  const groupByOrderByQuery = format(
    "GROUP BY a.article_id ORDER BY %I %s ",
    sort_by,
    order
  );
  const limitOffsetQuery = format(
    "LIMIT %L OFFSET %L;",
    restrictMaxLimit,
    offset
  );
  const countQuery = "SELECT COUNT(*)::INT FROM articles ";

  if (topic) {
    const whereQuery = format("WHERE topic = %L ", topic);

    return Promise.all([
      db.query(
        selectQuery + whereQuery + groupByOrderByQuery + limitOffsetQuery
      ),
      db.query(countQuery + whereQuery),
    ]).then(([topicResult, countResult]) => {
      return {
        articles: topicResult.rows,
        total_count: countResult.rows[0].count,
      };
    });
  } else {
    return Promise.all([
      db.query(selectQuery + groupByOrderByQuery + limitOffsetQuery),
      db.query(countQuery),
    ]).then(([articlesResult, countResult]) => {
      return {
        articles: articlesResult.rows,
        total_count: countResult.rows[0].count,
      };
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

exports.insertArticle = (author, title, body, topic, article_img_url) => {
  return db
    .query(
      `INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ( $1, $2, $3, $4, $5) RETURNING *;`,
      [author, title, body, topic, article_img_url]
    )
    .then(({ rows }) => {
      return this.selectArticleById(rows[0].article_id, (comment_count = ""));
    });
};

exports.deleteArticleWithId = (article_id) => {
  return db
    .query(`DELETE FROM articles WHERE article_id = $1 RETURNING *;`, [
      article_id,
    ])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "article_id Not Found!" });
      }
    });
};
