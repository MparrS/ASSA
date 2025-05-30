// en routes/empleados.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Ruta para obtener todos los empleados
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM users WHERE rol = "EMPLEADO"');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener empleados:', error);
        res.status(500).json({ message: 'Error al obtener empleados' });
    }
});

module.exports = router;
