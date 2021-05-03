const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, trim: true},
    lastName: { type: String, trim: true},
    username: { type: String, required: true, trim: true, unique: true},
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String }
});

var User = mongoose.model('User', UserSchema);
module.exports = User;