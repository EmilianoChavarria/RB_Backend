const Joi = require('joi')

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty':'el correo es obligatorio',
        'string.email':'el correo no tiene un formato valido'
    }),
    password :Joi.string().required().messages({
        'string.empty':'la contraseña es obligatorio',
    })
})

module.exports= {loginSchema}