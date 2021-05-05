const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware/auth');
const Room = require('../models/RoomModel');
const Chat = require('../models/chatModel');
const ObjectId = require('mongoose').Types.ObjectId;

router.get('/', requireLogin, async (req, res) => {
    var rooms = await Room.find({});
    var room = await Room.findOne({ roomName: "General" });
    var chats = await Chat.find({ roomId: room._id });
    payload = {
        "user": req.session.user.username,
        "userLoggedIn": req.session.user,
        "rooms": rooms,
        "roomName": room.roomName,
        "currentRoom": room._id,
        "chats": chats
    }
    res.render('home', payload);
});

router.get('/chat/:id', requireLogin, async (req, res) => {
    const roomId = req.params.id;
    if(!ObjectId.isValid(roomId)) {
        return res.render('error');
    }
    var room = await Room.findOne({ _id: roomId });
    var rooms = await Room.find({});
    var chats = await Chat.find({ roomId: roomId });
    payload = {
        "user": req.session.user.username,
        "userLoggedIn": req.session.user,
        "rooms": rooms,
        "roomName": room.roomName,
        "currentRoom": room._id,
        "chats": chats
    }
    res.render('chat', payload);
});


router.get('/logout', (req, res, next) => {
    if(req.session) {
        req.session.destroy(() => {
            res.redirect('/login')
        });
    }
});

module.exports = router;

