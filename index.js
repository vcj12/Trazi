const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Database connection configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'vcj12',
  password: 'Trazi01!',
  database: 'mydatabase',
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    process.exit(1);
  }
  console.log('Connected to the database as id ' + db.threadId);
});

// Define a route to GETD the population count for a specific city and state
app.get('/api/population/state/:state/city/:city', (req, res) => {
  const state = req.params.state;
  const city = req.params.city;

  const query = 'SELECT count FROM population WHERE state = ? AND cities = ?';

  db.query(query, [state, city], (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Database error' });
    } else {
      if (results.length > 0) { //If everything is well lets respond with the population
        const population = results[0].count;
        res.json({ population });
      } else {
        // No data found, so send a 400 error response
        res.status(400).json({ error: 'Error 400: State/City Combo not found' });
      }
    }
  });
});

// Start the Express.js server
const port = 5555;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

