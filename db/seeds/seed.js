const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, createRef } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics;`);
    })
    .then(() => {
      return db.query(`CREATE TABLE topics (
        slug VARCHAR(50) PRIMARY KEY,
        description VARCHAR(200),
        img_url VARCHAR(1000));`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users (
      username VARCHAR(20) PRIMARY KEY,
      name VARCHAR(50),
      avatar_url VARCHAR(1000));`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR(200),
        topic VARCHAR(50) REFERENCES topics(slug),
        author VARCHAR(20) REFERENCES users(username),
        body TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        votes INT DEFAULT 0,
        article_img_url VARCHAR(1000)  );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        article_id INT REFERENCES articles(article_id),
        body TEXT,
        votes INT DEFAULT 0,
        author VARCHAR(20) REFERENCES users(username),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );`);
    })
    .then(() => {
      const formattedTopicData = topicData.map((topic) => {
        return [topic.slug, topic.description, topic.img_url];
      });
      const insertTopicQuery = format(
        `INSERT INTO topics (slug, description, img_url) VALUES %L`,
        formattedTopicData
      );
      return db.query(insertTopicQuery);
    })
    .then(() => {
      const formattedUserData = userData.map((user) => {
        return [user.username, user.name, user.avatar_url];
      });
      const insertUserQuery = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L`,
        formattedUserData
      );
      return db.query(insertUserQuery);
    })
    .then(() => {
      const formattedArticleData = articleData.map((article) => {
        const newArticle = convertTimestampToDate(article);
        return [
          newArticle.title,
          newArticle.topic,
          newArticle.author,
          newArticle.body,
          newArticle.created_at,
          newArticle.votes,
          newArticle.article_img_url,
        ];
      });
      const insertArticleQuery = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`,
        formattedArticleData
      );
      return db.query(insertArticleQuery);
    })
    .then((result) => {
      const articlesRefObject = createRef(result.rows);
      const formattedComments = commentData.map((comment) => {
        const legitComment = convertTimestampToDate(comment);
        
        return [
          articlesRefObject[comment.article_title],
          legitComment.body,
          legitComment.votes,
          legitComment.author,
          legitComment.created_at,
        ];
      });

      const insertCommentQuery = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L`,
        formattedComments
      );

      return db.query(insertCommentQuery);
    });
  // .then(() => {
  //   const formattedCommentData = commentData.map((comment) => {
  //     return getArticleID(comment).then((data) => {
  //       const newComment = convertTimestampToDate(comment);
  //       //getting article_id
  //       const article_id = data.rows[0].article_id;
  //       //console.log(article_id, "<----getArticleID");
  //       return [
  //         article_id,
  //         newComment.body,
  //         newComment.votes,
  //         newComment.author,
  //         newComment.created_at,
  //       ];
  //     });
  //   });
  //   return Promise.all(formattedCommentData).then((data) => {
  //     //console.log(data, "<---afterPromise");
  //     const insertCommentQuery = format(
  //       `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L`,
  //       data
  //     );
  //     return db.query(insertCommentQuery);
  //   });
  // }); //The code works but forget to write tests for utils function and code looks more complex than from lecture
  // //<< write your first query in here.
};
module.exports = seed;
