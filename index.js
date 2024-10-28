require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.PORT,
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err);
        process.exit(1);
    }
    console.log('Conexión a la base de datos exitosa.');
});

app.get('/departamentos', (req, res) => {
    const query = 'SELECT * FROM departamentos';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/departamentos/:id/municipios', (req, res) => {
    const query = `
        SELECT m.nombre AS municipio, m.habitantes 
        FROM municipios m 
        JOIN departamentos d ON m.id_departamento = d.id_departamento 
        WHERE d.id_departamento = ?
    `;
    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/municipios/:id', (req, res) => {
    const query = `
        SELECT m.nombre AS municipio, m.habitantes, d.nombre AS departamento 
        FROM municipios m 
        JOIN departamentos d ON m.id_departamento = d.id_departamento 
        WHERE m.id_municipio = ?
    `;
    db.query(query, [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Municipio no encontrado' });
        res.json(results[0]);
    });
});

app.listen(port, () => {
    console.log(`API corriendo en http://localhost:${port}`);
});
