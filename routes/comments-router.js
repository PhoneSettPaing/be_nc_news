const commentsRouter = require("express").Router();
const { deleteCommentById } = require("../controllers/comments.controller");

commentsRouter.route("/:comment_id").delete(deleteCommentById);

module.exports = commentsRouter;
