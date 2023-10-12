const fs = require('fs');
const csv = require('csv-parser');
const mysql = require('mysql2');

// Database connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'vcj12',
  password: 'Trazi01!',
  port: 5555,
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
  // SQL query to create the table
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS population (
      id INT AUTO_INCREMENT PRIMARY KEY,
      city VARCHAR(255),
      state VARCHAR(255),
      population INT
    )
  `;
  
  connection.query(createTableQuery, (err) => {
    if (err) throw err;
    importCSVData();
  });
}

function importCSVData() {
  // Read and parse the CSV file
  fs.createReadStream('city_populations.csv')
    .pipe(csv())
    .on('data', (row) => {
      // Insert each row into the database
      connection.query(
        'INSERT INTO population (city, state, population) VALUES (?, ?, ?)',
        [row.city, row.state, row.population],
        (error) => {
          if (error) throw error;
        }
      );
    })
    .on('end', () => {
      console.log('Data imported successfully.');
      // Close the database connection
      connection.end();
    });
}
