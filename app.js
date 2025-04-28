const db = require("./db/connection");
const express = require("express");
const app = express();
const { getApi, badUrl } = require("./controllers/api.controller");

app.use(express.json());

app.get("/api", getApi);

app.all("/*url", badUrl);


// 500 handler
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg: "Internal Server Error!"});
})

module.exports = app;