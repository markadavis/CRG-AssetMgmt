/* HTTP Server base */

const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;

// Start the server.
http.createServer(app).listen(port, function() {
  console.log("Node server listening on port " + port);
});