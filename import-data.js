const fs = require('fs');
const readline = require('readline');
const mysql = require('mysql2');
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
  if (err) throw err;
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
