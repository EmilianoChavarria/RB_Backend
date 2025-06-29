const db = require('../database/dbConnection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (userdata) => {
    const { email, password } = userdata;

    const user = await db('user').where({ email }).first();

    if (!user || !user.status) {
        throw new Error('Credenciales inválidas');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign(
        {
            id_user: user.id_user,
            role: user.role,
            nombre:user.nombre
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return token;
};
