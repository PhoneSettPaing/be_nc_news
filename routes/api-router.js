const apiRouter = require("express").Router();
const { getApi } = require("../controllers/api.controller");

const {
  topicsRouter,
  articlesRouter,
  commentsRouter,
  usersRouter,
} = require("./exportRouters");

apiRouter.get("/", getApi);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
