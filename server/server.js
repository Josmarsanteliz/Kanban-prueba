import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const app = express();
app.use(cors());
app.use(express.json());

// Base de datos SQLite en archivo local
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) console.error('Error al abrir la BD', err.message);
  else console.log('Conectado a la base de datos SQLite.');
});

// Crear tabla de tareas
db.run(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'normal',
  startDate TEXT,
  endDate TEXT
)`);

// Crear tabla de notas para el Inbox
db.run(`CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  createdAt TEXT
)`);

// --- TABLA DE COLUMNAS ---
db.run(`CREATE TABLE IF NOT EXISTS columns (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  position INTEGER
)`);

// Asegurar siempre las columnas por defecto
const defaultCols = [
  { id: 'todo', title: 'Por hacer', position: 1 },
  { id: 'in_progress', title: 'En progreso', position: 2 },
  { id: 'done', title: 'Completado', position: 3 }
];
defaultCols.forEach(col => {
  db.run(`INSERT OR IGNORE INTO columns (id, title, position) VALUES (?, ?, ?)`, [col.id, col.title, col.position]);
});


// --- RUTAS DE COLUMNAS ---

app.get('/api/columns', (req, res) => {
  db.all(`SELECT * FROM columns ORDER BY position ASC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ columns: rows });
  });
});

app.post('/api/columns', (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'El título es requerido' });
  }

  const id = title.toLowerCase().trim().replace(/\s+/g, '_').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  db.get(`SELECT MAX(position) as maxPos FROM columns`, [], (err, row) => {
    const position = (row?.maxPos || 0) + 1;
    
    db.run(`INSERT INTO columns (id, title, position) VALUES (?, ?, ?)`, [id, title, position], function (err) {
      if (err) return res.status(500).json({ error: 'La columna ya existe' });
      res.json({ message: 'Columna creada', column: { id, title, position } });
    });
  });
});

app.delete('/api/columns/:id', (req, res) => {
  const { id } = req.params;
  
  if (['todo', 'in_progress', 'done'].includes(id)) {
    return res.status(400).json({ error: 'No se pueden eliminar las columnas predeterminadas' });
  }

  db.run(`UPDATE tasks SET status = 'todo' WHERE status = ?`, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    db.run(`DELETE FROM columns WHERE id = ?`, [id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Columna eliminada con éxito' });
    });
  });
});


// --- RUTAS DE TAREAS ---

app.get('/api/tasks', (req, res) => {
  db.all(`SELECT * FROM tasks`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const formattedRows = rows.map(task => ({
      ...task,
      startDate: task.startDate || task.start_date || null,
      endDate: task.endDate || task.end_date || null,
    }));
    res.json({ tasks: formattedRows });
  });
});

app.post('/api/tasks', (req, res) => {
  const { title, description, status, priority, startDate, endDate } = req.body;
  const sql = `INSERT INTO tasks (title, description, status, priority, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [title, description, status || 'todo', priority || 'normal', startDate || null, endDate || null];

  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Tarea creada con éxito' });
  });
});

app.put('/api/tasks/:id', (req, res) => {
  const { title, description, status, priority, startDate, endDate } = req.body;
  const sql = `UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, startDate = ?, endDate = ? WHERE id = ?`;
  const params = [title, description, status, priority, startDate || null, endDate || null, req.params.id];

  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Tarea actualizada con éxito' });
  });
});

app.delete('/api/tasks/:id', (req, res) => {
  db.run(`DELETE FROM tasks WHERE id = ?`, req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Tarea eliminada' });
  });
});


// --- RUTAS DE NOTAS (INBOX) ---

app.get('/api/notes', (req, res) => {
  db.all(`SELECT * FROM notes ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ notes: rows });
  });
});

app.post('/api/notes', (req, res) => {
  const { content } = req.body;
  const createdAt = new Date().toISOString();
  const sql = `INSERT INTO notes (content, createdAt) VALUES (?, ?)`;
  
  db.run(sql, [content, createdAt], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, content, createdAt, message: 'Nota creada con éxito' });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  db.run(`DELETE FROM notes WHERE id = ?`, req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Nota eliminada' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
const cors = require('cors');
app.use(cors());