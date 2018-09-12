const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');


//load models
require('./models/User');
require('./models/Posts');
require('./models/Resume');
require('./models/Experiances');
require('./models/Educations');
require('./models/Company');
require('./models/Jobs');
require('./models/JobWanted');
require('./models/Applications');
require('./models/savedJob');

//passport config
require('./config/passport')(passport);
require('./config/passport-local')(passport);

//load routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const posts = require('./routes/posts');
const jobs = require('./routes/jobs');
const resumes = require('./routes/resumes');
//load keys
const keys = require('./config/keys');

//Handlebars Helpers
const {
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon
} = require('./helpers/hbs');

//map global promise
mongoose.Promise = global.Promise;

//mongoose connect
mongoose.connect(keys.mongoURI, {
  useNewUrlParser: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const app = express();

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Method verride Middelware
app.use(methodOverride('_method'));

//Handlebars Middleware
app.engine('handlebars', exphbs({
  helpers: {
    truncate: truncate,
    stripTags: stripTags,
    formatDate,
    select,
    editIcon
  },
  defaultLayout: 'main'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
//passport midleware
app.use(passport.initialize());
app.use(passport.session());

//set Global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//set static folder
app.use(express.static(path.join(__dirname, 'public')));
//Use routes
app.use('/', index);
app.use('/auth', auth);
app.use('/posts', posts);
app.use('/jobs', jobs);
app.use('/candidate-resume', resumes);
app.use('*', function(req, res){
  res.status(404).render('index/404')
});
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});
