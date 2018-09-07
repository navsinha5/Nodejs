const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('./models/User');
require('./config/passport');

var app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret:'secret', resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(require('./routes'));

mongoose.connect('mongodb://localhost/sample_db');

app.use((req, res, next) => {
    let err = new Error('not found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        'error': {
            message: err.message,
            error: err
        }
    });
});


app.listen(3000, () => {
    console.log('listening on port 3000');
});
