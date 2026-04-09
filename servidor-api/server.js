const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Configuración de Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MySQL (XAMPP)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Por defecto en XAMPP es vacío
    database: 'analisis_costos'
});

db.connect(err => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err.message);
        return;
    }
    console.log('✅ Conectado a la base de datos MySQL');
});

// --- RUTAS DE LA API ---

// 1. GUARDAR (POST) - Inserta nuevos proyectos
app.post('/proyectos', (req, res) => {
    const { nombre, horasEstimadas, horasReales, costoHora, usuario_correo } = req.body;
    
    // Validamos que lleguen los datos mínimos
    if (!nombre || !usuario_correo) {
        return res.status(400).json({ error: 'Faltan campos obligatorios (nombre o correo)' });
    }

    const sql = 'INSERT INTO proyectos (nombre, horasEstimadas, horasReales, costoHora, usuario_correo) VALUES (?, ?, ?, ?, ?)';
    const values = [nombre, horasEstimadas, horasReales, costoHora, usuario_correo];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('❌ Error al insertar:', err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log('📝 Registro guardado con ID:', result.insertId);
        res.json({ mensaje: 'Guardado con éxito', id: result.insertId });
    });
});

// 2. LEER (GET) - Filtra por el correo del usuario logueado
app.get('/proyectos/:correo', (req, res) => {
    const correo = req.params.correo;
    const sql = 'SELECT * FROM proyectos WHERE usuario_correo = ?';
    
    db.query(sql, [correo], (err, results) => {
        if (err) {
            console.error('❌ Error al leer datos:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// 3. ELIMINAR (DELETE) - Borra registros por ID
app.delete('/proyectos/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM proyectos WHERE id = ?';
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('❌ Error al eliminar:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ mensaje: 'Eliminado con éxito' });
    });
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});