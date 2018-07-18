const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/facebook',
  passport.authenticate('facebook',{scope: ['email']}));

router.get('/facebook/callback', function(req, res, next){
  passport.authenticate('facebook', { successRedirect: '/',
    failureRedirect: '/login' })(req, res, next);
});





router.get('/verify', (req, res)=>{
  if(req.user){
    console.log(req.user);
  }else{
    console.log('Not Auth')
  }
});

router.get('/logout', (req, res)=>{
  req.logout();
  res.redirect('/');
});

module.exports = router;