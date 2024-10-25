const mongoose = require('mongoose')
const userschema = mongoose.Schema({
    username : String , 
    password : String , 
    email:String,
    company:String,
    profile_pic:String
}, {
    timestamps: true // {{ edit_1 }}: Enable timestamps
})

const usermodel = mongoose.model("Users" , userschema)
module.exports =usermodel