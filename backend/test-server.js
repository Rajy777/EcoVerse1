const express = require('express');
require('dotenv').config();

const app = express();
const PORT = 3001;

console.log('Starting simple test server...');

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Test server running' });
});

console.log('About to listen on port', PORT);

app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server error:', err);
});