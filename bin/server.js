const app = require('../app');
const http = require('http');

// Get port from the environment or use 3000 as default
const port = process.env.PORT || '3000';
app.set('port', port);

// Create an HTTP server
const server = http.createServer(app);

// Listen on provided port
server.listen(port);
server.on('error', handleError);
server.on('listening', () => {
  console.log(`Server listening on port ${port}`);
});

// Error handler
function handleError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}