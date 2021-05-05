const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const ChatSchema = new Schema({
    userId: { type: Schema.Types.ObjectId , ref:'User' },
    username: { type: String, trim: true, required: true },
    message:{ type: String, required: true },
    roomId: { type: Schema.Types.ObjectId , ref:'Room'}
},{
	timestamps: true
});

var Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;