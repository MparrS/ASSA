const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const empleadosRoutes = require('./models/empleados');
const Usuario = require('./models/usuario');
const postsRoutes = require('./routes/postsRoutes');
const authRoutes = require('./routes/authRoutes');
const commentsRoutes = require('./routes/commentsRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/empleados', empleadosRoutes);
app.use('/api/usuario', Usuario);
app.use('/api/posts', postsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentsRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando');
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
