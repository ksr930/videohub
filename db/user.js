var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')
var schema = mongoose.Schema;

var userSchema = new schema({
    username:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    video:[  
{
    title:String,
    address:String,
    _id:false
}
    ]

    
})

userSchema.methods.hashPassword=(password)=>{
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10))
}

userSchema.methods.comparePassword=(password,hash)=> {
    return bcrypt.compareSync(password,hash)
    
}




module.exports = mongoose.model('users',userSchema,'users')