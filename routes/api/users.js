const express = require('express');
const router = express.Router();

const usersController = require('../../controllers/usersController');
const verifyJWT = require('../../middleware/verifyJWT');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

router.route('/')
    .get(usersController.getAllUsers);

router.route('/:id')
    .get(usersController.getUser)
    // .put(verifyJWT, usersController.updateUser)
    .delete(verifyJWT, verifyRoles(ROLES_LIST.Admin), usersController.deleteUser);

module.exports = router;
