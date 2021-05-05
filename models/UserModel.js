const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, trim: true},
    username: { type: String, required: true, trim: true, unique: true},
    password: { type: String }
});

var User = mongoose.model('User', UserSchema);
module.exports = User;