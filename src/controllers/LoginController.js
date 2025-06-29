const loginService = require('../services/authService');

exports.login = async (req, res) => {
    try {
        const token = await loginService.login(req.body);
        res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            token
        });
    } catch (err) {
        res.status(401).json({
            success: false,
            message: err.message || 'Error interno al iniciar sesión'
        });
    }
};
