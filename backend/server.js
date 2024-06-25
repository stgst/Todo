// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');

const app = express();
const PORT = 3000;

// 中間件
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
app.use(session({
  secret: 'M9eQiIjGeNt6VowaUvSU',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database: ', err.message);
  } else {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);
    db.run(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task TEXT NOT NULL,
        deadline TEXT NOT NULL,
        category TEXT NOT NULL,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    console.log('Connected to the SQLite database.');
  }
});

// Register
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, password], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (row) {
      req.session.userId = row.id;
      res.json({ id: row.id, email: row.email });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

// Authentication Model
const authMiddleware = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

// Add Task
app.post('/todos', authMiddleware, (req, res) => {
  const { task, deadline, category } = req.body;
  const user_id = req.session.userId;
  db.run(`INSERT INTO todos (task, deadline, category, user_id) VALUES (?, ?, ?, ?)`, [task, deadline, category, user_id], function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ id: this.lastID, task: task, deadline: deadline, category: category, user_id: user_id});
  });
});

// Fetch Tasks
app.get('/todos', authMiddleware, (req, res) => {
  const user_id = req.session.userId;
  db.all(`SELECT * FROM todos WHERE user_id = ?`, [user_id], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.delete('/todos/:id', (req, res) => {
  const user_id = req.session.userId;
  const todoId = req.params.id;
  
  db.all(`SELECT * FROM todos WHERE id = ? AND user_id = ?`, [todoId, user_id], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(rows);
  });

  db.run('DELETE FROM todos WHERE id = ? AND user_id = ?', [todoId, user_id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    } else {
      res.status(200);
    }
  });
});

// 登出 API
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
