const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const empleadosRoutes = require('./models/empleados');
const Usuario = require('./models/usuario');
const publicacionesRoutes = require('./routes/publicaciones');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/empleados', empleadosRoutes);
app.use('/api/usuario', Usuario);
app.use('/api/publicaciones', publicacionesRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
