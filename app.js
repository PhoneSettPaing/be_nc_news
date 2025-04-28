const db = require("./db/connection");
const express = require("express");
const app = express();
const { getApi, badUrl } = require("./controllers/api.controller");
const { getTopics } = require("./controllers/topics.controller");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.all("/*url", badUrl);
//End of express chain

//Start of error handling middleware chain
// 500 handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error!" });
});

module.exports = app;
