const express = require('express');
const mysql = require('mysql2/promise'); // Using mysql2
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors middleware

const app = express();

// Middleware
app.use(cors()); // Use cors middleware to enable CORS
app.use(bodyParser.json());
app.use(express.static('public'));

// MySQL Connection
let db;

async function connectDB() {
  try {
    db = await mysql.createPool({
      host: 'localhost',
      user: 'root', // Provided username
      password: process.env.DB_PASSWORD || '#AleksaSQL16', // Use environment variable or fallback
      database: 'nodemysql' // Provided database name
    });
    console.log('MySQL Connected...');
  } catch (error) {
    console.error('Error connecting to MySQL:', error.message);
    // Instead of exiting, let the error handling middleware handle the error
    throw error;
  }
}

connectDB().catch(console.error); // Use .catch to handle errors

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

// Create Item
app.post('/item', async (req, res, next) => {
  try {
    if (!db) throw new Error('Database connection is not established');
    
    const { name, description } = req.body;
    const [rows, fields] = await db.execute('INSERT INTO items (name, description) VALUES (?, ?)', [name, description]);
    res.send('Item added...');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Read All Items
app.get('/items', async (req, res, next) => {
  try {
    if (!db) throw new Error('Database connection is not established');
    
    const [rows, fields] = await db.execute('SELECT * FROM items');
    res.json(rows);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Update Item
app.put('/item/:id', async (req, res, next) => {
  try {
    if (!db) throw new Error('Database connection is not established');
    
    const { name, description } = req.body;
    const [rows, fields] = await db.execute('UPDATE items SET name = ?, description = ? WHERE id = ?', [name, description, req.params.id]);
    res.send('Item updated...');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Delete Item
app.delete('/item/:id', async (req, res, next) => {
  try {
    if (!db) throw new Error('Database connection is not established');
    
    const [rows, fields] = await db.execute('DELETE FROM items WHERE id = ?', [req.params.id]);
    res.send('Item deleted...');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
