const express = require("express");
const app = express();
const { badUrl } = require("./controllers/api.controller");
const apiRouter = require("./routes/api-router");
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.all("/*splat", badUrl);
//End of express chain

//Start of error handling middleware chain

//custom errorhandler
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

//psql errorhandler
app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23503" || err.code === "23505") {
    if (err.constraint === "comments_author_fkey") {
      res.status(404).send({ msg: "username Not Found!" });
    } else if (err.constraint === "comments_article_id_fkey") {
      res.status(404).send({ msg: "article_id Not Found!" });
    } else if (err.constraint === "articles_author_fkey") {
      res.status(404).send({ msg: "author(username) Not Found!" });
    } else if (err.constraint === "articles_topic_fkey") {
      res.status(404).send({ msg: "topic(slug) Not Found!" });
    } else if (err.constraint === "topics_pkey") {
      res.status(409).send({ msg: "Topic/slug already exists!" });
    } else {
      res.status(400).send({ msg: "Bad Request!" });
    }
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
