const Joi = require('joi');

const guestSchema = Joi.object({
  name: Joi.string().min(2).max(45).required().messages({
        'string.empty': 'El nombre es obligatorio',
        'string.min': 'El nombre debe tener al menos 3 caracteres'
    }),
  lastname: Joi.string().min(3).max(45).required().messages({
        'string.empty': 'El primer apellido es obligatorio',
        'string.min': 'El primer apellido debe tener al menos 3 caracteres'
    }),
  surname: Joi.string().min(2).max(45).messages({
        'string.empty': 'El segundo apellido es obligatorio',
        'string.min': 'El nombre debe tener al menos 3 caracteres'
    }),
  email: Joi.string().email().required().messages({
        'string.email': 'El correo no tiene un formato válido',
        'string.empty': 'El correo es obligatorio'
    }),
  phone_number: Joi.string().pattern(/^[0-9]+$/).messages({
        'string.pattern': 'El telefono no tiene un formato válido',
        'string.empty': 'El telefono es obligatorio'
    })
});

const guestsArraySchema = Joi.object({
  guests: Joi.array().items(guestSchema).min(1).required(),
  invitationId: Joi.number().integer().required()
});

module.exports = {
  guestsArraySchema
};