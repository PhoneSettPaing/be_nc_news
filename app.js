const db = require("./db/connection");
const express = require("express");
const app = express();
const { getApi, badUrl } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticleById,
  getArticles,
  patchArticleById,
} = require("./controllers/articles.controller");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
} = require("./controllers/comments.controller");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("/*splat", badUrl);
//End of express chain

//Start of error handling middleware chain

//404 custom errorhandler
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

//400 sql errorhandler
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request!" });
  } else {
    next(err);
  }
});

// 500 handler
app.use((err, req, res, next) => {
  console.log(err, "Unhandled Error");
  res.status(500).send({ msg: "Internal Server Error!" });
});

module.exports = app;
