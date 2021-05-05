require('dotenv').config();
require('./db');
const express = require('express');
const app = express();
const path = require("path");
const http = require('http');
const socketIo = require('socket.io');
const Routes = require('./routes');
const moment = require('moment');
const session = require('express-session');
const MongoStore = require('connect-mongo');
// const Room = require('./models/RoomModel');
const Chat = require('./models/chatModel');
var shortDateFormat = "ddd @ h:mmA"; 
app.locals.moment = moment;
app.locals.shortDateFormat = shortDateFormat;

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
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.DB_LINK,
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(Routes);

// const arr = [{ roomName: 'General' },  { roomName: 'Backend' },  { roomName: 'Frontend' }, { roomName: 'Career Talk' }, { roomName: 'Random' }];
// Room.insertMany(arr, function(error, docs) {
//     console.log(docs)
// });


function formatMessage(username, text) {
    return {
        username,
        text,
        time : moment().format('h:mm a')
    }
}

// Socket.io Set up

const botName = 'Zuri Bot'
// Run when client connects
io.on('connection', socket => {

    const { username, userId, room, roomName } = socket.handshake.query;
    
    socket.on('joinRoom', () => {
        
        socket.join(room);

         // Welcome current User
         socket.emit('message', formatMessage(botName, `Welcome to ${roomName} Room`));

        // Broadcast when a user connects
        socket.broadcast
        .to(room)
        .emit('message', formatMessage(botName, `${username} has joined the chat room`))
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        const data = {
           "userId" : userId,
           "username": username,
           "message": msg,
           "roomId": room
        }

        Chat.create(data).then((chat) => {
            io.to(room).emit('message', formatMessage(username, msg))
        }).catch(err => console.log(err));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        io.to(room).emit(
            'message', 
            formatMessage(botName, `${username} has left the chat`)
        );
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
    res.render('error');
});



server.listen(PORT, () => {
    console.log(`Server running at Port ${PORT}`);
});
