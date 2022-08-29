const express = require('express');

const postsController = require('../controllers/postsController');

const postsRoute = express.Router();
const createPostValidation = require('../middlewares/createPostValidation');
const validateJWT = require('../middlewares/validateJWT');

postsRoute.post('/', validateJWT, createPostValidation, postsController.create);

module.exports = postsRoute;
