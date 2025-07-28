const {sendRecoveryEmail} = require('../services/emailService');
const db = require('../database/dbConnection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usedTokens = require('../utils/TokenCache')
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await db('user').where({ email }).first();
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }


        const token = jwt.sign(
            { id: user.id_user },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        await sendRecoveryEmail(email, token);

        return res.json({ message: 'Correo enviado con instrucciones para restablecer la contraseña' });
    } catch (error) {
        console.error("Error en requestPasswordReset:", error);
        return res.status(500).json({ message: 'Error al procesar la solicitud de recuperación' });
    }
};




const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {

        if (usedTokens.has(token)){
            return res.status(400).json({
                message: 'Token ya usado'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const hashed = await bcrypt.hash(newPassword, 10);

        await db('user').update({password:hashed}).where({id_user : decoded.id})

        usedTokens.add(token);
        res.json({ message: 'Contraseña restablecida con éxito' });
    } catch (err) {
        res.status(400).json({ message: 'Token inválido o expirado' });
    }
};
module.exports = {
    requestPasswordReset,
    resetPassword
};
