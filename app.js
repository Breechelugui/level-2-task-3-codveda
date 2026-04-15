require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');

const app = express();
app.use(express.json());

connectDB();

app.use('/api/users', require('./src/routes/users'));
app.use('/api/posts', require('./src/routes/posts'));

// Global error handler
app.use((err, req, res, next) => {
  const status = err.name === 'ValidationError' ? 400 : 500;
  const message = err.name === 'ValidationError'
    ? Object.values(err.errors).map(e => e.message).join(', ')
    : 'Internal Server Error';
  res.status(status).json({ error: message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
