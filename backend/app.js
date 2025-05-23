const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const empleadosRoutes = require('./models/empleados');
const publicaciones = require('./models/publicaciones');
const Usuario = require('./models/usuario');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/empleados', empleadosRoutes);
app.use('/api/publicaciones', publicaciones);
app.use('/api/usuario', Usuario);

app.get('/', (req, res) => {
    res.send('API funcionando');
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});