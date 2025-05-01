const express = require("express");
const app = express();
const { badUrl } = require("./controllers/api.controller");
const apiRouter = require("./routes/api-router");

app.use(express.json());

app.use("/api", apiRouter);

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
