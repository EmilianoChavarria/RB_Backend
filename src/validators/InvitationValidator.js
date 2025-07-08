const Joi = require('joi');

const invitationSchema = Joi.object({
    address: Joi.string().min(3).max(300).required().messages({
        'string.empty': 'La dirección es requerida',
        'string.min': 'La dirección debe tener al menos 3 caracteres',
        'string.max': 'La dirección no debe exceder los 300 caracteres'
    }),
    scheduled_at: Joi.date().min('now').required().messages({
        'date.base': 'La fecha debe tener un formato válido',
        'date.min': 'La fecha no puede estar en el pasado',
        'any.required': 'La fecha es requerida'
    }),
    templates_id_templates: Joi.number().integer().required().messages({
        'number.base': 'El ID de la plantilla debe ser un número entero',
        'any.required': 'El ID de la plantilla es requerido'
    }),
    user_id_user: Joi.number().integer().required().messages({
        'number.base': 'El ID del usuario debe ser un número entero',
        'any.required': 'El ID del usuario es requerido'
    })
});

module.exports = { invitationSchema };
