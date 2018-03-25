const http = require('http');
const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const app = express();

app.use(passport.initialize());

//TODO: to coordinate with users in database
  passport.use(new FacebookStrategy({
    clientID : process.env.FB_APP_ID,
    clientSecret : process.env.FB_APP_SECRET,
    callbackURL : 'https://facebook-connect-app.herokuapp.com/callback'
  },
    function(accessToken,refreshToken,userProfile,done){
      return done(null,userProfile);
    }
))

app.get('/',(req,res,next)=> {
  res.sendFile('index.html',{root:__dirname+'/'});
})

const permissions = ['email','read_insights','manage_pages','pages_show_list'];

app.get('/connect',passport.authenticate('facebook',{session: false}));
app.get('/callback',passport.authenticate('facebook',{failuredRedirect:'/',session:false,scope: permissions}),(req,res) => {
  res.status(200).json({message:'success',data:req.user});
})
app.get('/logout',(req,res)=> {
  req.logout();
  res.redirect('/');
})

const server = http.createServer(app).listen(process.env.PORT||3000);
