var express = require('express')
var router = express.Router();
var user = require('../db/user')
var loggedin = function (req,res,next) {
   
    if(req.isAuthenticated()){
        next();
    }
    else{
        res.redirect('/login')
    }
    
}

router.get('/',(req,res)=>{
   
    res.render('Home')
})

router.get('/login',(req,res,next)=>{
   
    res.render('login')
})

router.get('/signup',(req,res,next)=>{
    
    res.render('signup')
})



router.get('/profile',loggedin,(req,res,next)=>{

  
res.render('profile',{name:req.user})
})

router.get('/logout',(req,res,next)=>{
    req.logout()
    res.render('home')
})



router.get('/index',loggedin,(req,res)=>{
    res.render('index')
})


router.get("/media",loggedin, (req, res) => {
  user.find({ 'username': req.user.username }, (err, data) => {
    if (err) console.log(err);
    else {
        
    
       res.render("videoplayer", {  d:data[0].video });
    }
  });
});

module.exports=router;