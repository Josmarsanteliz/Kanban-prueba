import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const app = express();
app.use(cors());
app.use(express.json());

// Base de datos SQLite en memoria o archivo local
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) console.error('Error al abrir la BD', err.message);
  else console.log('Conectado a la base de datos SQLite.');
});

// Crear tabla con campos de fecha incluidos
db.run(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'normal',
  startDate TEXT,
  endDate TEXT
)`);
db.run(`CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  createdAt TEXT
)`);

// Obtener todas las tareas
// Al crear o actualizar, asegúrate de recibir y enviar ambos formatos si es necesario:
app.get('/api/tasks', (req, res) => {
  db.all(`SELECT * FROM tasks`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Opcional: mapeamos para asegurar que el frontend siempre reciba startDate y endDate
    const formattedRows = rows.map(task => ({
      ...task,
      startDate: task.startDate || task.start_date || null,
      endDate: task.endDate || task.end_date || null,
    }));
    res.json({ tasks: formattedRows });
  });
});


// En tu server.js, actualiza el POST para depurar si llegan las fechas:
app.post('/api/tasks', (req, res) => {
  console.log("DATOS RECIBIDOS EN EL SERVIDOR:", req.body); // <-- Esto te mostrará si el front sí envía las fechas
  const { title, description, status, priority, startDate, endDate } = req.body;
  const sql = `INSERT INTO tasks (title, description, status, priority, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [title, description, status || 'todo', priority || 'normal', startDate || null, endDate || null];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("ERROR SQL:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, message: 'Tarea creada con éxito' });
  });
});

// Actualizar una tarea (incluyendo edición completa de fechas)
app.put('/api/tasks/:id', (req, res) => {
  const { title, description, status, priority, startDate, endDate } = req.body;
  const sql = `UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, startDate = ?, endDate = ? WHERE id = ?`;
  const params = [title, description, status, priority, startDate || null, endDate || null, req.params.id];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Tarea actualizada con éxito' });
  });
});

// Eliminar una tarea
app.delete('/api/tasks/:id', (req, res) => {
  db.run(`DELETE FROM tasks WHERE id = ?`, req.params.id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Tarea eliminada' });
  });
});
// Obtener todas las notas
app.get('/api/notes', (req, res) => {
  db.all(`SELECT * FROM notes ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ notes: rows });
  });
});

// Crear una nota rápida
app.post('/api/notes', (req, res) => {
  const { content } = req.body;
  const createdAt = new Date().toISOString();
  const sql = `INSERT INTO notes (content, createdAt) VALUES (?, ?)`;
  
  db.run(sql, [content, createdAt], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, content, createdAt, message: 'Nota creada con éxito' });
  });
});

// Eliminar una nota
app.delete('/api/notes/:id', (req, res) => {
  db.run(`DELETE FROM notes WHERE id = ?`, req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Nota eliminada' });
  });
});
app.listen(5000, () => {
  console.log('Servidor corriendo en http://localhost:5000');
});