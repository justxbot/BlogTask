require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const uuid = require('uuid')
const bcrypt = require('bcrypt')
const connectToDb = require('./DBconnection.js')
const isAuth = require('./middlewares/isAuth.js')

//Mongoose models
const User = require('./models/User.js')
const Blog = require('./models/Blog.js')

//enviroment variables
const JWT_KEY = process.env.JWT_KEY

//applying body parser
app.use(cookieParser())
app.use(bodyParser.json())

//connecting to mongodb database
connectToDb()


//user signup
app.post('/signup',async(req,res)=>{
    let formData = req.body
    //checking if data is empty or unset
    if(formData.fname=='' || formData.lname=='' || formData.email=='' || formData.pwd==''){
        return res.status(401).json({message:'Fill in all required inputs'})
    }

    //checking if account exists
    try{
        const isMatch = await User.findOne({email:formData.email})
        if(isMatch){
            return res.status(401).json({message:'Can not create account with this email'})
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({message:'Something went wrong, please try again later'})
    }

    //hashing password
    const hashedPwd = await bcrypt.hash(formData.pwd,10)

    //setting new hashed password as main
    formData.pwd = hashedPwd

    //creating user
    try{
        const user = await User.create(formData)
        if(user){
            return res.status(200).json('Account created successfully')
        }
    }
    catch(err){
        return res.status(500).json('Something went wrong, please try again later')
    }

})

//user login
app.post('/login',async(req,res)=>{
    const formData = req.body

    //checking if data are empty
    if(formData.email=='' ||formData.pwd==''){
        return res.status(401).status('Fill in all required inputs')
    }

    //user login logic
    try{
        //checking if user exists
        const user = await User.findOne({email:formData.email})
        if(!user){
            return res.status(404).json({message:'No such user with this email'})
        }
        //checking if password match
        const pwdMatch = await bcrypt.compare(formData.pwd,user.pwd)
        if(!pwdMatch){
            return res.status(401).json({message:'Wrong password'})
        }
        //Logging user in using JWT
        const token = jwt.sign(user.toObject(), JWT_KEY)
        res.cookie('authToken',token,{
            httpOnly:true, //prevent client side to access the cookie
            secure:false, //false for http now but should be true when over https
            sameSite:'strict',//to protect against CSRF attacks
        })
        return res.status(200).json({message:'logged in successfully', user:user})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:'Something went wrong, please try again later'})
    }
})

//user logout
app.post('/logout',(req,res)=>{
    res.clearCookie('authToken')
    res.status(200).json({message:'Logged out successfully'})
})

//create blog
app.post('/blog',isAuth, async(req,res)=>{
    const formData = req.body
    //verifying data not empty
    if(formData.title!='' || formData.messages.length<=0){
        return res.status(401).json({message:'Data can not be empty'})
    }
    // Iterate over the messages array
    const updatedMessages = formData.messages.map((message) => {
        if (message.type === 'img') {
            const imageData = message.content; // Base64 image data
            const uniqueName = `${uuid()}.jpg`; // Generate a unique name
            const imagePath = path.join(mediaDir, uniqueName);
    
            // Save the image as a file
            const base64Data = imageData.replace(/^data:image\/\w+;base64,/, ''); // Clean the Base64 string
            fs.writeFileSync(imagePath, base64Data, { encoding: 'base64' });
    
            // Log the URL of the saved image
            const imageUrl = `/media/${uniqueName}`;
            console.log(`Image saved: ${imageUrl}`);
    
            // Update the message content with the image URL
            return { ...message, content: imageUrl };
        }
    
        return message; // Return non-image messages unchanged
    });

    //creating or storing the blog with the new urls instead of the img
    try{
        const blog = await Blog.create({
            title:formData.title,
            messages:updatedMessages,
            userId:req.user._id
        })
        if(!blog){
            return res.status(500).json({message:"Couldn't create your blog right now, please try again later"})
        }
        return res.status(200).json({message:"Blog created successfully"})
    }
    catch(err){
        return res.status(500).json({message:"Something went wrong, please try again later"})
    }
})

//remove blog
app.post('/blog/delete',isAuth,async(req,res)=>{
    const blogId = req.body.blogId
    //validating if blog id is not empty
    if(blogId==''){
        return res.status(401).json({message:'Please select a blog to delete'})
    }
    try{
        //deleting and fetching the deleted blog
        const deletedBlog = await Blog.findOneAndDelete({_id:blogId,userId:req.user._id})
        if(!deletedBlog){
            return res.status(500).json({message:"We could not delete this blog right now, try again later"})
        }
        //deleting the blog's image files
        deletedBlog.messages.map(message=>{
            if(message.type==='img'){
                fs.unlink('.'+message.content,(err)=>{
                    if (err) {
                        console.error(`Error deleting file: ${err.message}`);
                    } else {
                        console.log(`File deleted successfully`);
                    }
                })
            }
        })
    }
    catch(err){
        return res.status(500).json({message:"Something went wrong, please try again later"})
    }
})

app.listen(3000,()=>{
    console.log("app running");
})
