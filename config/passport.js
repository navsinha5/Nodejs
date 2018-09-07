const passport = require('passport');
const Issuer = require('openid-client').Issuer;
const LocalStrategy = require('passport-local').Strategy;
const OAuth2Strategy = require('passport-oauth2').Strategy;
const OpenIdStrategy = require('openid-client').Strategy;
const OpenIdStrategy2 = require('passport-openidconnect').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

const localStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (username, password, done) => {
    User.findOne({email: username}).then((user) => {
        if(!user.validPassword(password)){
            return done(null, false, {error: {'email or password': 'is invalid'}});
        }
        return done(null, user);
    }, (err) => {
        return done(err);
    }).catch(done);
});

const oauth2Strategy = new OAuth2Strategy({
    authorizationURL: 'https://assistantiot.auth.us-east-1.amazoncognito.com/oauth2/authorize',
    tokenURL: 'https://assistantiot.auth.us-east-1.amazoncognito.com/oauth2/token',
    clientID: '5aoo6hrnmihbi92952m6ttndl5',
    clientSecret: '1peh6cg2pn8pcgoiv5s91vkiti3b90gm493sqe69q86shgj080gk',
    callbackURL: 'http://localhost:3000/api/oauth/success'
}, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
});

// =======================================================================================================
// const cognitoIssuer = new Issuer({
//     issuer: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_THQ9rUBCO',
//     authorization_endpoint: 'https://assistantiot.auth.us-east-1.amazoncognito.com/oauth2/authorize',
//     token_endpoint: 'https://assistantiot.auth.us-east-1.amazoncognito.com/oauth2/token',
//     userinfo_endpoint: 'https://assistantiot.auth.us-east-1.amazoncognito.com/oauth2/userinfo',
//     jwks_uri: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_THQ9rUBCO/.well-known/jwks.json'
// });

// const cognitoClient = new cognitoIssuer.Client({
//     client_id: '5aoo6hrnmihbi92952m6ttndl5',
//     client_secret: '1peh6cg2pn8pcgoiv5s91vkiti3b90gm493sqe69q86shgj080gk'
// });

// const params = {
//     redirect_uri: 'http://localhost:3000/api/oauth/success'
// };

// const openIdStrategy = new OpenIdStrategy({cognitoClient, params}, 
//     (tokenSet, userInfo, done) => {
//         done(null, [tokenSet, userInfo]);
// });
// ==================================================================================================

const openIdStrategy2 = new OpenIdStrategy2({
    issuer: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_THQ9rUBCO',
    authorizationURL: 'https://assistantiot.auth.us-east-1.amazoncognito.com/oauth2/authorize',
    tokenURL: 'https://assistantiot.auth.us-east-1.amazoncognito.com/oauth2/token',
    userInfoURL: 'https://assistantiot.auth.us-east-1.amazoncognito.com/oauth2/userinfo',
    jwksURL: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_THQ9rUBCO/.well-known/jwks.json',
    callbackURL: 'http://localhost:3000/api/oauth/success',
    clientID: '5aoo6hrnmihbi92952m6ttndl5',
    clientSecret: '1peh6cg2pn8pcgoiv5s91vkiti3b90gm493sqe69q86shgj080gk',
    passReqToCallback: true,
    skipUserProfile: true
}, (req, issuer, userId, profile, jwtClaims, accessToken, refreshToken, params, done) => {
    console.log(req);
    console.log(issuer);
    console.log(userId);
    console.log(profile);
    console.log(jwtClaims);
    console.log(accessToken);
    console.log(refreshToken);
    console.log(params);

    req.session.accessToken = accessToken;
    
    done(null, true);
});

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use('local', localStrategy);
//passport.use('oauth2', oauth2Strategy);
//passport.use('oidc', openIdStrategy);
passport.use('openid', openIdStrategy2);