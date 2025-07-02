const Joi = require('joi');

const templateSchema = Joi.object({
  template_name: Joi.string().max(45).required().messages({
    'string.empty': 'El nombre del template es requerido',
    'string.max': 'El nombre no debe exceder los 45 caracteres'
  }),
  image: Joi.alternatives().try(
    Joi.binary(),
    Joi.string().regex(/^data:image\/(jpeg|png|gif);base64,/)
  ).required().messages({
    'alternatives.match': 'La imagen debe ser un buffer binario o un string base64 válido',
    'any.required': 'La imagen es requerida'
  }),
  mime_type: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required().messages({
    'any.only': 'El tipo MIME debe ser image/jpeg, image/png o image/gif',
    'any.required': 'El tipo MIME es requerido'
  }),
  status: Joi.number().integer().valid(0, 1).default(1).messages({
    'number.base': 'El estado debe ser un número',
    'any.only': 'El estado debe ser 0 (inactivo) o 1 (activo)'
  })
});

const updateTemplateSchema = Joi.object({
  template_name: Joi.string().max(45),
  image: Joi.alternatives().try(
    Joi.binary(),
    Joi.string().regex(/^data:image\/(jpeg|png|gif);base64,/)
  ),
  mime_type: Joi.string().valid('image/jpeg', 'image/png', 'image/gif'),
  status: Joi.number().integer().valid(0, 1)
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

module.exports = { templateSchema, updateTemplateSchema };