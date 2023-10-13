const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const fs = require('fs');
const readline = require('readline');
const http = require('http');

// Database connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'vcj12',
  password: 'Trazi01!',
  port: 3306,
});

// Create the database and use it
connection.query('CREATE DATABASE IF NOT EXISTS mydatabase', (err) => {
  //if (err) throw err;
  connection.query('USE mydatabase', (err) => {
    if (err) throw err;
    createTable();
  });
});

function createTable() {
  // SQL query to create the 'population' table
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS population (
      id INT AUTO_INCREMENT PRIMARY KEY,
      cities VARCHAR(255),
      state VARCHAR(255),
      count INT
    )
  `;

  connection.query(createTableQuery, (err) => {
    if (err) throw err;
    importCSVData();
  });
}

	//Lets get the data from csv into the table
function importCSVData() {
  const rl = readline.createInterface({
    input: fs.createReadStream('city_populations.csv'),
    crlfDelay: Infinity,
  });

// When the CSV is read properly start doing some work
  rl.on('line', (line) => {
    const [cities, state, count] = line.split(','); // Split by comma
    const countValue = parseInt(count, 10); // Make this a INT

	//Final data check for paranoia
    if (isValidCity(cities) && isValidState(state) && !isNaN(countValue)) {
      // Insert each row into the 'population' table
      connection.query(
        'INSERT INTO population (cities, state, count) VALUES (?, ?, ?)',
        [cities, state, countValue],
        (error) => {
          if (error) throw error;
        }
      );
    }
  });
}

// Having problems with the INT
function isValidCity(city) {
  // Check if the value contains alphabetic characters (a-z or A-Z)
  return /[a-zA-Z]/.test(city);
}

function isValidState(state) {
  // Check if the value contains alphabetic characters (a-z or A-Z)
  return /[a-zA-Z]/.test(state);
}

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


// Define a route for updating or creating population data
app.put('/api/population/state/:state/city/:city', (req, res) => {
  const state = req.params.state.toLowerCase(); // Make state case-insensitive
  const city = req.params.city.toLowerCase(); // Make city case-insensitive
  const population = req.body; // Body should be plain text with the new population

  // Check if the city/state combination exists
  const selectQuery = 'SELECT * FROM population WHERE state = ? AND cities = ?';
  db.query(selectQuery, [state, city], (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: 'Database error' });
    } else {
      if (results.length > 0) {
        // City/state combination exists, so update the population
        const updateQuery = 'UPDATE population SET count = ? WHERE state = ? AND cities = ?';
        db.query(updateQuery, [population, state, city], (updateError) => {
          if (updateError) {
            res.status(400).json({ error: 'Error 400: Data could not be updated' });
          } else {
            res.status(200).json({ message: 'Data updated successfully' });
          }
        });
      } else {
        // City/state combination does not exist, so create new data
        const insertQuery = 'INSERT INTO population (state, cities, count) VALUES (?, ?, ?)';
        db.query(insertQuery, [state, city, population], (insertError) => {
          if (insertError) {
            res.status(400).json({ error: 'Error 400: Data could not be added' });
          } else {
            res.status(201).json({ message: 'Data created successfully' });
          }
        });
      }
    }
  });
});




// Start the Express.js server
const port = 5555;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
