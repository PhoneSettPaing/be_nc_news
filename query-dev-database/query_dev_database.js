const db = require("../db/connection");
const fs = require("fs/promises");

db.query(`SELECT * FROM users`).then((result) => {
  //console.log(result.rows);
  fs.writeFile("1-all-users.json", JSON.stringify(result.rows, null, 2)).then(
    () => {
      console.log("Finish querying for all users");
    }
  );
});

db.query(`SELECT * FROM articles WHERE topic = 'coding';`).then((result) => {
  fs.writeFile(
    "2-coding-articles.json",
    JSON.stringify(result.rows, null, 2)
  ).then(() => {
    console.log("Finish querying for articles where the topic is coding");
  });
});

db.query(`SELECT * FROM comments WHERE votes < 0;`).then((result) => {
  fs.writeFile(
    "3-votes0-comments.json",
    JSON.stringify(result.rows, null, 2)
  ).then(() => {
    console.log(
      "Finish querying for comments where the votes are less than zero"
    );
  });
});

db.query(`SELECT * FROM topics;`).then((result) => {
  fs.writeFile("4-all-topics.json", JSON.stringify(result.rows, null, 2)).then(
    () => {
      console.log("Finish querying for all topics");
    }
  );
});

db.query(`SELECT * FROM articles WHERE author = 'grumpy19';`).then((result) => {
  fs.writeFile(
    "5-grumpy19-articles.json",
    JSON.stringify(result.rows, null, 2)
  ).then(() => {
    console.log("Finish querying for articles by user grumpy19");
  });
});

db.query("SELECT * FROM comments WHERE votes > 10;").then((result) => {
  fs.writeFile(
    "6-votes10-above-comments.json",
    JSON.stringify(result.rows, null, 2)
  ).then(() => {
    console.log("Finish querying for comments that have more than 10 votes");
  });
});

db.end();
