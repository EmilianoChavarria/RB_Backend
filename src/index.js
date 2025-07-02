require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes')
const templateRoutes = require('./routes/templateRoutes');
const verifyToken = require('./middlewares/verifyToken')
const verifyRole = require('./middlewares/verifyRole')
const bodyParser = require('body-parser');


const app = express()
app.use(cors())

app.use(express.json())

// Configuración para manejar JSON y límites aumentados
app.use(bodyParser.json({
    limit: '10mb',
    extended: true
}));
app.use(bodyParser.urlencoded({
    limit: '10mb',
    extended: true
}));

// Rutas
app.use('/api/usuarios', userRoutes);
app.use('/api/auth', authRoutes);

// Endpoint de prueba general con autenticación
app.get('/api/prueba', verifyToken, (req, res) => {
    res.json({
        message: `¡Hola ${req.user.nombre || req.user.email}!`,
        rol: req.user.role,
        payload: req.user
    });
});

app.get('/api/prueba/userRole', verifyToken, verifyRole('admin'), (req, res) => {
    res.json({
        message: `¡Hola ${req.user.nombre || req.user.email}!`,
        rol: req.user.role,
        payload: req.user
    });
});

app.use('/templates', templateRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);

    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            success: false,
            error: 'El archivo excede el límite de 5MB'
        });
    }

    res.status(500).json({ success: false, error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`app running in http://localhost:${PORT}`)
})