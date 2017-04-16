var express = require('express');
var router = express.Router();
var CommentHandler = require('../handlers/comments');
var role = require('../helpers/role')();

module.exports = function () {
    var commentHandler = new CommentHandler();

    router.post('/', role.isUser, commentHandler.addComment);
    router.get('/', role.isAdmin, commentHandler.getComments);
    router.get('/:id', commentHandler.getComment);
    router.put('/:id', role.isAdmin, commentHandler.changeComment);
    router.delete('/:id', role.isAdmin, commentHandler.deleteComment);

    return router;
};
