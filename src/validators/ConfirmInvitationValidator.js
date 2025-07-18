const joi = require('joi')

const confirmInvitationValidator = joi.object({
    response_status: joi.string().valid('pending', 'reject','confirmed').required().messages({
        'any.only': 'El estado de respuesta debe ser uno de los siguientes: pending, reject, confirmed',
        'any.required': 'El estado de respuesta es obligatorio'
    }),
    comments: joi.string().max(500).optional(),
    guest_id_guest: joi.number().integer().required().messages({
        'number.base': 'El ID del invitado debe ser un número entero',
        'number.integer': 'El ID del invitado debe ser un número entero',
        'any.required': 'El ID del invitado es obligatorio'
    }),
})


const confirmInvitationValidatorUpdate = joi.object({
    response_status: joi.string().valid('pending', 'reject','confirmed').required().messages({
        'any.only': 'El estado de respuesta debe ser uno de los siguientes: pending, reject, confirmed',
        'any.required': 'El estado de respuesta es obligatorio'
    }),
    comments: joi.string().max(500).optional()
})


module.exports = { confirmInvitationValidator, confirmInvitationValidatorUpdate}