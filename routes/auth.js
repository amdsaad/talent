const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
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