const { createServer } = require('http');
const app = require('./app');

require('dotenv').config();

const server = createServer(app);

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
