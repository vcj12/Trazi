const http = require('http');
const express = require('express');
const mysql = require('mysql2');

const app = express();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'vcj12',
  password: 'Trazi01!',
  database: 'mydatabase',
  port: 5555,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    process.exit(1); // Exit the application if there's a database connection error
  }
  console.log('Connected to the database as id ' + db.threadId);
});

// Define your API endpoints and route handlers here
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start your Express.js server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});




/*


// Create the server
const server = http.createServer((req, res) => {
	
	// Check that we have found it 
  if (req.method === 'GET' && req.url.startsWith('/api/population/state/')) {
	  
	// Split the url into a array then store the stats, city data so we can work with it
    const parts = req.url.split('/');
	
    const stateIndex = parts.indexOf('state') + 1;
    const cityIndex = parts.indexOf('city') + 1;
	
	const state = parts[stateIndex];
	const city = parts[cityIndex];
	
	// We are all good display status: 200
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ state, city, population}));

  } else {
	// Something went wrong
    res.statusCode = 404; // Not Found
    res.end('Endpoint not found');
  }
});

//Requested port
const port = 5555;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
*/