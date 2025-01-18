const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    message:{
        type:Array,
        required:true
    },
    featuredImage:{
        type:String,
        required:false,
    },
    userId:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,
        default: Date.now()
    },
})

module.exports = mongoose.model('Blog',blogSchema)