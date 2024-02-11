// app.js

// Import necessary modules
const express = require('express');
const fs = require('fs');
const cookieParser = require('cookie-parser'); // Import cookie-parser middleware

// Create an Express application
const app = express();

// Use middleware to parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Use cookie-parser middleware to handle cookies
app.use(cookieParser());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route to serve the login form
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

// Route to serve the send message form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/sendMessage.html');
});

// Route to handle login form submission
app.post('/login', (req, res) => {
    const username = req.body.username;
    res.cookie('username', username); // Store username in a cookie
    res.redirect('/');
});

// Route to handle sending a message
app.post('/send', (req, res) => {
    const username = req.cookies.username; // Retrieve username from the cookie
    const message = req.body.message;
    fs.appendFile('messages.txt', `${username}: ${message}\n`, (err) => {
        if (err) throw err;
        //console.log('Message saved!');
        res.redirect('/');
    });
});

// Route to read messages from the file and send them to the client
app.get('/messages', (req, res) => {
    fs.readFile('messages.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).send('Error reading file');
            return;
        }
        res.send(data);
    });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
