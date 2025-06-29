const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { userSchema, updateUserSchema  } = require('../validators/userValidator');

//se define el middleware de validación
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message, success:false });
  next();
};

router.get('/', userController.getAllUsers);
router.post('/', validate(userSchema), userController.createUser);
router.put('/:id', validate(updateUserSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);



module.exports = router;
