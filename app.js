// app.js
const express = require('express');
require('dotenv').config();
const path = require('path');
const cors = require('cors');

const app = express();

// Import Routes
const summarizeRoute = require('./routes/summarize');

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the homepage from 'views' directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'homepage.html'));
});

// Use Routes
app.use('/summarize', summarizeRoute);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
