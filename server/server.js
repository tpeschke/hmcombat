const express = require('express')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , dotenv = require('dotenv').config()
    , massive = require('massive')
    , session = require('express-session')
    , passport = require('passport')
    , Auth0Strategy = require('passport-auth0')

const sqlCtrl = require('./controller/sqlController')

const app = new express()
app.use(bodyParser.json())
app.use(cors())
app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new Auth0Strategy({
    domain: process.env.AUTH_DOMAIN,
    clientID: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    callbackURL: process.env.AUTH_CALLBACK,
    scope: 'openid profile'
}, function(accessToken, refreshToken, extraParams, profile, done){
    let { displayName, user_id, picture } = profile;
    const db = app.get('db');

    db.find_user([user_id]).then(function(users) {
        if (!users[0]) {
            db.create_user([
                displayName,
                picture,
                user_id
            ]).then(users => {
                return done(null,users[0].id)
            })
        } else {
                return done(null,users[0].id)
        }
    })
}))

///////////////////////////////////
////TESTING TOPLEVEL MIDDLEWARE////
///COMMENET OUT WHEN AUTH0 READY///
///////////////////////////////////
// app.use((req, res, next) =>{
//     if(!req.session.user){
//         req.session.user = {
//             user_id: 1,
//             user_name: "harrison ford", 
//             email: "adventureBuilder2049@gmail.com", 
//             name: "adventure", 
//             profile_picture : "http://www.placekitten.com/200/250",
//             auth_id: "adsgfhaoibjmoi5wrhgiuaosfngiuasdhg;ioarhdgv;ou"
//         }
//     }
//     next();
// })


app.get('/auth', passport.authenticate('auth0'));
app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: 'http://localhost:5679/SavedFields'
}));

passport.serializeUser((id, done) => {
    done(null,id)
})
passport.deserializeUser((id, done) => {
    app.get('db').find_session_user([id]).then( (user) => {
        return done(null, user[0]);  
    })
})

app.get('/auth/logout', function(req, res) {
    req.logOut();
    res.redirect('http://localhost:5679/')
})

// ==================================================
app.get('/auth/me', (req,res) => {
    if (!req.user) {
        res.status(404).send('User not found.');
    } else {
        res.status(200).send(req.user);
    }
})

app.get('/api/combats/:id', sqlCtrl.getAllCombats);
app.get('/api/combat/:id', sqlCtrl.loadCombatants);
app.get('/api/status/:id', sqlCtrl.getAllStatuses)

app.get('/api/battle', sqlCtrl.newField);
app.delete('/api/battle/:id', sqlCtrl.deleteField);
app.patch('/api/battle', sqlCtrl.saveField)


const port = process.env.PORT

massive(process.env.CONNECTION_STRING).then(dbInstance => {
    app.set('db', dbInstance);
    app.listen(port, _ => {
        console.log(`Autumn Ends: The Frogs Settle Down Into The Earth ${port}`);
    })
});