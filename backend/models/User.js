const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    pwd:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,
        default: Date.now()
    },
})

module.exports = mongoose.model('User',userSchema)