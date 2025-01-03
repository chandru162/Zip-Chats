const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    verified:{
        type:Boolean,
        default:false,
    },
    login:{
        type:Boolean,
        default:false,
    },
    profilePicture: {
        type: String,
        default: ''
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    friends: [{
        type: String,
        ref: 'User'
    }],

});

const usermodele= mongoose.model('User', userSchema)
module.exports = usermodele;

