require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER ,  
    password: process.env.DB_PASSWORD, 
    database: 'assa_mas',
});

db.connect((err) => {
    if (err) {
        console.error('Error de conexión:', err);
    } else {
        console.log('Conexion exitosa');
    }
});

module.exports = db;
