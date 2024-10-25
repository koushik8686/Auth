const mongoose = require('mongoose')
const companysechema = mongoose.Schema({ 
    email:String,
    company:String,
    profile_pic:String,
}, {
    timestamps: true // {{ edit_1 }}: Enable timestamps
})

const usermodel = mongoose.model("companies" , companysechema)
module.exports =usermodel