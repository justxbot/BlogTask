const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    data:{
        type:Array,
        required:true
    },
    featuredImage:{
        type:String,
        required:false,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User', // Model name
        required: true
    },
    created_at:{
        type:Date,
        default: Date.now()
    },
})

module.exports = mongoose.model('Blog',blogSchema)