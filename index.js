const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');
require('dotenv').config();

// Create express server
const app = express();

// Data Base
dbConnection();

// CORS
app.use(cors());

// Public Directory
app.use( express.static('public') );

// Reading and parsing the body
app.use( express.json() );

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// Listening to requests
app.listen( process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});