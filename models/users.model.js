const db = require("../db/connection");

exports.selectUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1;`, [username])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "username Not Found!" });
      }

      return rows[0];
    });
};

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};
