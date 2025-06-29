const express = require('express')
const router = express.Router();
const LoginController = require('../controllers/LoginController')
const {loginSchema} = require('../validators/AuthValidator')

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message, success:false });
    next();
};

router.post('/',validate(loginSchema), LoginController.login)

module.exports = router;