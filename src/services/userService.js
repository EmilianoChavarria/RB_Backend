const db = require('../database/dbConnection');
const bcrypt = require('bcrypt');

const getAll = async () => {
    return await db('user').select('*');
};

const createUser = async (userData) => {
    const { nombre, apellido, email, password, role, status } = userData;
  
    // Correo único
    const existingUser = await db('usuarios').where({ email }).first();
    if (existingUser) {
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
      status
    };
  
    return await db('usuarios').insert(newUser);
  };

module.exports = {
    getAll,
    createUser
};