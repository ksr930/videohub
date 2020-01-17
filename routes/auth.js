var express = require('express')
var router = express.Router();
var user = require('../db/user')

module.exports= (passport)=> {
    
    router.post('/signup', (req,res) =>{
       
       
        var username= req.body.username;
        var password= req.body.password;
        var email=req.body.email;
          user.findOne({username:username},(err,doc)=>{
              if(err)
              {
                  res.status(500).send('error occurred')
              }
              else {
                  if(doc){
                      res.status(500).send('username already exist')
                  }
                  else{
var record= new user()
record.username=username;
record.email=email;
record.password=record.hashPassword(password)
record.save(function(err,user){
if(err){
    res.status(500).send('db error')
}
else{
    passport.authenticate('local')(req,res,function () {
        res.redirect('/profile')
    })
}
})
                  }
              }
          })
     
    })

   router.post('/login',passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login"
}), function (req, res) {

}) 
    return router;
}