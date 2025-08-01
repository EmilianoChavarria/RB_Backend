const Joi = require('joi');

const eventTypeSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 3 characters'
    })
});

const updateEventTypeSchema = Joi.object({
    name: Joi.string().min(3).max(100).messages({
        'string.min': 'Name must be at least 3 characters'
    })
});

module.exports = {
    eventTypeSchema,
    updateEventTypeSchema
};