require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');


const app = express()
app.use(cors())

app.use(express.json())

// Rutas
app.use('/api/usuarios', userRoutes);



const PORT = process.env.PORT || 3000

app.listen(PORT, () =>{
    console.log(`app running in http://localhost:3000`)
})