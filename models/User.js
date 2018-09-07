const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;

let UserSchema = new mongoose.Schema({
    email: {type: String, lowercase: true, unique: true, 
            required: [true, "can't be blank"]},
    name: {type: String, required: true},
    hash: String,
    salt: String
}, {timestamps: true});

UserSchema.plugin(uniqueValidator, {'message': 'is already taken.'});

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function(password) {
    let newHash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return newHash === this.hash;
};

UserSchema.methods.generateJWT = function() {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    
    return jwt.sign({
        id: this.id,
        name: this.name,
        email: this.email,
        exp: parseInt(exp.getTime() / 1000)
    }, secret);
};

UserSchema.methods.toAuthJSON = function() {
    return {
        email: this.email,
        token: this.generateJWT()
    };
};

mongoose.model('User', UserSchema);