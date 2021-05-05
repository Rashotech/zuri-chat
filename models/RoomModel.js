const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    roomName: { type: String, required: true }
});

var Room = mongoose.model('Room', RoomSchema);
module.exports = Room;