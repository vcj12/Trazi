const http = require('http');

// Create the server
const server = http.createServer((req, res) => {
	
	// Check that we have found it 
  if (req.method === 'GET' && req.url.startsWith('/api/population/state/')) {
    const parts = req.url.split('/');
	// Split the url into a array then store the stats, city dataso we can work with it
    const stateIndex = parts.indexOf('state') + 1;
    const cityIndex = parts.indexOf('city') + 1;
	// We are all good display status: 200
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(parts));
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
