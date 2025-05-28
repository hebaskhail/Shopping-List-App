const express = require('express');
const router = express.Router();
const login = require('../../controllers/auth');
const loginSchema = require('../../validationSchemas/auth');
const { validateRequest } = require('../../middlewares/validators/validateRequest');

router.post('/login', loginSchema, validateRequest, login);

module.exports = router;
