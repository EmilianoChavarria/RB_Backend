const Joi = require('joi');

const userSchema = Joi.object({
    nombre: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'El nombre es obligatorio',
        'string.min': 'El nombre debe tener al menos 3 caracteres'
    }),
    apellido: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'El apellido es obligatorio',
        'string.min': 'El apellido debe tener al menos 3 caracteres'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'El correo no tiene un formato válido',
        'string.empty': 'El correo es obligatorio'
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'La contraseña es obligatoria',
        'string.min': 'La contraseña debe tener al menos 6 caracteres'
    }),
    role: Joi.string().valid('admin', 'user').required().messages({
        'any.only': 'El rol debe ser admin o user',
        'string.empty': 'El rol es obligatorio'
    }),
});

const updateUserSchema = Joi.object({
    nombre: Joi.string().min(3).max(50).messages({
        'string.min': 'El nombre debe tener al menos 3 caracteres'
    }),
    apellido: Joi.string().min(3).max(50).messages({
        'string.min': 'El apellido debe tener al menos 3 caracteres'
    })
}).or('nombre', 'apellido');


module.exports = {
    userSchema,
    updateUserSchema
};
