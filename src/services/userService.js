const db = require('../database/dbConnection');
const bcrypt = require('bcrypt');

const getAll = async () => {
    return await db('user').select('*');
};

const createUser = async (userData) => {
    const { nombre, apellido, email, password, role, status } = userData;

    // Correo único
    const existUser = await db('user').where({ email }).first();
    if (existUser) {
        throw new Error('El correo ya está registrado');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        nombre,
        apellido,
        email,
        password: hashedPassword,
        role,
        status: 1
    };

    return await db('user').insert(newUser);
};

const updateUser = async (id_user, userData) => {
    const user = await db('user').where({ id_user }).first();
    if (!user) throw new Error('Usuario no encontrado');

    return await db('user')
        .where({ id_user })
        .update(userData);
};



module.exports = {
    getAll,
    createUser,
    updateUser
};