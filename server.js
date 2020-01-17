var express = require('express')
var path = require('path')
var bodyparser= require('body-parser')
var multer = require('multer')
var users = require('./db/user')
var mongoose = require('mongoose')
var session = require('express-session')
var passport = require('passport')
var index = require('./routes/index');
var auth = require('./routes/auth')(passport)
var cookieParser = require('cookie-parser')
require('./passport')(passport)

mongoose.connect('mongodb://localhost/login',(err)=>{
    if(err)
    {console.log(err)}
    else{
        console.log('database connected')
    }
})

var app = express();

app.use(cookieParser())

app.use(bodyparser.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')))

app.use(session({
    secret:'thesecret',
    saveUninitialized: false,
    resave:false,
   
    
}))

app.use(passport.initialize())
app.use(passport.session())


app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
 
  next();
});

app.use(index)
app.use('/auth', auth)



const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function(req, file, cb) {
    const v =
      file.fieldname + "." + Date.now() + path.extname(file.originalname);

    cb(null, v);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("myimage");

function checkFileType(file, cb) {
  const filetypes = /mp4/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("error video only", cb);
  }
}


var loggedin = function(req, res, next) {
  console.log(req.session);
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
};


app.post("/upload",loggedin, (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.render("index");
    } else {
      
      let addr = {
        title: req.body.title,
        address: "\\uploads\\" + req.file.filename
      };
      console.log(req.user.username)
      users.findOneAndUpdate(
        { username: req.user.username },
        
        {
          $push: { video: addr }
        },
        (err, data) => {
          if (err) console.log(err);
          else {
            
          }
        }
      );
      res.redirect("/media");
    }
  });
});





app.listen(3000,(err)=>{
    if(err)
    console.log(err)
    else{
        console.log('connect serverS')
    }
})

