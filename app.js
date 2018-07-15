const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');


//load user model
require('./models/User');

//passport config
require('./config/passport')(passport);

//load routes
const index = require('./routes/index');
const auth = require('./routes/auth');

//load keys
const keys = require('./config/keys');

//map global promise
mongoose.Promise = global.Promise;

//mongoose connect
mongoose.connect(keys.mongoURI,{
  useNewUrlParser: true
})
  .then(()=> console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express();

//Handlebars Middleware
app.engine('handlebars',exphbs({
defaultLayout: 'main'
}));
app.set('view engine','handlebars');

app.use(cookieParser());
app.use(session({
  secret:"secret",
  resave:false,
  saveUninitialized:false
}))
//passport midleware
app.use(passport.initialize());
app.use(passport.session());

//set Global vars
app.use((req, res, next)=>{
  res.locals.user = req.user || null;
  next();
});

//Use routes
app.use('/',index);
app.use('/auth',auth);

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
  console.log(`Server started on port ${port}`)
});
