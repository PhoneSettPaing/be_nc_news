const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.checkTopic = (topic) => {
  if (topic.length === 0) {
    return [];
  } else {
    return db
      .query("SELECT * FROM topics WHERE slug = $1;", [topic])
      .then(({ rows }) => {
        if (!rows.length) {
          return Promise.reject({ status: 404, msg: "topic Not Found!" });
        }
        return rows;
      });
  }
};
