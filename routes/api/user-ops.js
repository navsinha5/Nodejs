const router = require('express').Router();
const passport = require('passport');
const auth = require('../auth');
const mongoose = require('mongoose');
const User = mongoose.model('User');

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if(err){
            return next(err);
        }

        if(user){
            res.json(user.toAuthJSON());
        }else{
            res.status(400).json(info);
        }
    })(req, res, next);
});

router.post('/register', (req, res, next) => {
    let user = new User();
    user.email = req.body.email;
    user.name = req.body.name;
    user.setPassword(req.body.password);
    
    user.save((err) => {
        if(err){
            return next(err);
        }

        res.json(user.toAuthJSON());
    });
});

router.get('/profile', auth.required, (req, res, next) => {
    User.findById(req.payload.id).then((user) => {
        return res.json(user);
    }, (err) => {
        return next(err);
    });
});

router.get('/oauth', passport.authenticate('oauth2'));

// router.get('/oauth/success', (req, res, next) => {
//     passport.authenticate('oauth2', {session: false}, (err, data, info) => {
//         if(err){
//             next(err);
//         }
//         console.log(data);
//         res.redirect('http://localhost:4200/register');
//     })(req, res, next);
// });

router.get('/openid', passport.authenticate('openid'));

router.get('/oauth/success', (req, res, next) => {
    passport.authenticate('openid', (err, data, info) => {
        if(err){
            console.log(err);
            return next(err);
        }
        console.log(data);
        res.redirect('https://example.com');
    })(req, res, next);
});

module.exports = router;