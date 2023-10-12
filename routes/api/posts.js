const express = require('express');
const router = express.Router();

const postsController = require('../../controllers/postsController');
const verifyJWT = require('../../middleware/verifyJWT');

router.route('/')
    .get(postsController.getAllPosts)
    .post(verifyJWT, postsController.createPost);

router.route('/:id')
    .get(postsController.getPost)
    .put(verifyJWT, postsController.updatePost)
    .delete(verifyJWT, postsController.deletePost)
    .patch(verifyJWT, postsController.updateReactions);

module.exports = router;
