require('dotenv').config();
require('./db');
const express = require('express');
const app = express();
const path = require("path");
const http = require('http');
var session = require('express-session');
const socketIo = require('socket.io');
const Routes = require('./routes');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketIo(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

app.use(Routes);

// Socket.io Set up

const botName = 'Zuri Bot'
// Run when client connects
io.on('connection', socket => {

    socket.on('joinRoom', () => {
        // Welcome current User
        socket.emit('message', formatMessage(botName, `Welcome to zuri Chat`));
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
       
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
    
    });
})

// middleware to handle invalid routes
app.use((req, res, next) => {
    const error = new Error('Could not find this route');
    throw error;
})

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.render('error')
});


server.listen(PORT, () => {
    console.log(`Server running at Port ${PORT}`);
});
