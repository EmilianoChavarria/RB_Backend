require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes')
const verifyToken = require('./middlewares/verifyToken')
const verifyRole = require('./middlewares/verifyRole')

const app = express()
app.use(cors())

app.use(express.json())

// Rutas
app.use('/api/usuarios', userRoutes);
app.use('/api/auth',authRoutes);

// Endpoint de prueba general con autenticación
app.get('/api/prueba', verifyToken, (req, res) => {
    res.json({
        message: `¡Hola ${req.user.nombre || req.user.email}!`,
        rol: req.user.role,
        payload: req.user
    });
});

app.get('/api/prueba/userRole', verifyToken,verifyRole('admin'), (req, res) => {
    res.json({
        message: `¡Hola ${req.user.nombre || req.user.email}!`,
        rol: req.user.role,
        payload: req.user
    });
});


const PORT = process.env.PORT || 3000

app.listen(PORT, () =>{
    console.log(`app running in http://localhost:${PORT}`)
})