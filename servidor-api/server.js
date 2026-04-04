const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MySQL (XAMPP)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'analisis_costos'
});

db.connect(err => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err);
        return;
    }
    console.log('✅ Conectado a la base de datos MySQL');
});

// GUARDAR (POST)
app.post('/proyectos', (req, res) => {
    const { nombre, horasEstimadas, horasReales, costoHora, usuario_correo } = req.body;
    const sql = 'INSERT INTO proyectos (nombre, horasEstimadas, horasReales, costoHora, usuario_correo) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nombre, horasEstimadas, horasReales, costoHora, usuario_correo], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Guardado con éxito', id: result.insertId });
    });
});

// LEER (GET) - Requisito: Solo visualizar sus propios datos
app.get('/proyectos/:correo', (req, res) => {
    const correo = req.params.correo;
    const sql = 'SELECT * FROM proyectos WHERE usuario_correo = ?';
    db.query(sql, [correo], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ELIMINAR (DELETE) - Corrige el error de la terminal [image_32f307]
app.delete('/proyectos/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM proyectos WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Eliminado' });
    });
});

app.listen(3000, () => {
    console.log('🚀 Servidor corriendo en http://localhost:3000');
});