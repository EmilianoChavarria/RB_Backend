const userService = require('../services/userService');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAll();
        //TODO: Verificar estructura de las response
        res.json({ data: users, error: false, status: 200 });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener usuarios', error: err.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json({ message: 'Usuario creado correctamente', id: user[0] });
    } catch (err) {
        res.status(500).json({ message: 'Error al crear usuario', error: err.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        await userService.updateUser(id, req.body);
        res.json({ message: 'Usuario actualizado correctamente', error: false });
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar usuario', error: err.message });
    }
};
