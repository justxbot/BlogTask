require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const multer = require('multer')
const uuid = require('uuid')
const bcrypt = require('bcryptjs')
const connectToDb = require('./DBconnection.js')
const isAuth = require('./middlewares/isAuth.js')
const cors = require('cors')
const path= require('path')
//Mongoose models
const User = require('./models/User.js')
const Blog = require('./models/Blog.js')

//enviroment variables
const PORT = process.env.PORT
const JWT_KEY = process.env.JWT_KEY
const CLIENT_DOMAIN = process.env.CLIENT_DOMAIN

//applying Middlewares
app.use(cookieParser())
app.use(bodyParser.json())
app.use(cors({
    origin:CLIENT_DOMAIN,
    credentials:true
}))
app.use('/media', express.static('media'));

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
            return res.status(200).json({message:'Account created successfully'})
        }
    }
    catch(err){
        return res.status(500).json({message:'Something went wrong, please try again later'})
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
            secure:true, //false for http now but should be true when over https
            sameSite:'none',//to protect against CSRF attacks
        })
        return res.status(200).json({message:'logged in successfully', user:user})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:'Something went wrong, please try again later'})
    }
})
//check user status (if logged in or not)
app.get('/checkUser',(req,res)=>{
    const token = req.cookies.authToken
    if(!token){
        res.status(200).json({status:false})
    }
    try{
        const user = jwt.verify(token,JWT_KEY)
        if(user){
            return res.status(200).json({status:true, user:user})
        }
    }
    catch(err){
        console.log(err);
    }
})
//user logout
app.post('/logout',(req,res)=>{
    res.clearCookie('authToken')
    res.status(200).json({message:'Logged out successfully'})
})

//get all blogs
app.get('/blogs',isAuth, async(req,res)=>{
    try{
        const blogs = await Blog.find().populate({
            path: 'userId', 
            select: 'fname lname',
          });
        if(blogs){
            return res.status(200).json({message:"blogs successfully loaded",blogs:blogs})
        }
    }
    catch(err){
        return res.status(500).json({message:"something went wrong, try again later",error:err})
    }
})

//get 1 blog by id
app.get('/blogs/:id',isAuth,async(req,res)=>{
    const blogId = req.params.id
    try{
        const blog = await Blog.findOne({_id:blogId}).populate({
            path: 'userId', 
            select: 'fname lname',
          });
        if(!blog){
            return res.status(404).json({message:"No blog was found"})
        }
        return res.status(200).json({message:"blogs successfully loaded",blog:blog})
    }
    catch(err){
        return res.status(500).json({message:"something went wrong, try again later",error:err})
    }
}) 
//get user blogs (my blogs)
app.get('/myblogs',isAuth, async(req,res)=>{
    try{
        const userBlogs = await Blog.find({userId:req.user._id})
        return res.status(200).json({message:"blogs successfully loaded",userBlogs:userBlogs})
    }
    catch(err){
        return res.status(500).json({message:"something went wrong, try again later",error:err})
    }
})
// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './media')
    },
    filename: function (req, file, cb) {
        cb(null, `${uuid.v1()}${path.extname(file.originalname)}`)
    }
});

const upload = multer({ storage: storage });
//create blog
app.post('/blog', isAuth, upload.any(), async (req, res) => {
    try {
        const { title } = req.body;
        const data = JSON.parse(req.body.data);
        
        // Process uploaded files
        const files = req.files;
        const fileMap = {};
        
        // Create a map of temporary keys to final URLs
        files.forEach(file => {
            if (file.fieldname === 'featuredImage') {
                fileMap.featuredImage = `/media/${file.filename}`;
            } else {
                fileMap[file.fieldname] = `/media/${file.filename}`;
            }
        });
        
        // Replace temporary keys with actual URLs in the data
        const processedData = data.map(item => {
            if (item.type === 'img' && fileMap[item.content]) {
                return {
                    ...item,
                    content: fileMap[item.content]
                };
            }
            return item;
        });

        console.log("Featured Image URL:", fileMap.featuredImage); // Debug log
        
        // Create the blog post with featuredImage
        const blog = await Blog.create({
            title,
            data: processedData,
            userId: req.user._id,
            featuredImage: fileMap.featuredImage  // Add the featuredImage URL
        });
        
        res.status(200).json({ message: "Blog created successfully" });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ message: "Something went wrong, please try again later" });
    }
});

//edit blog
app.post('/blog/edit', isAuth, upload.any(), async(req, res) => {
    try {
        const blogId = req.body._id;
        const { title } = req.body;
        const data = JSON.parse(req.body.data);
        
        // Find the blog first
        const theBlog = await Blog.findOne({ _id: blogId, userId: req.user._id });
        if (!theBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Process uploaded files
        const files = req.files;
        const fileMap = {};

        // Remove old media files only if new ones are uploaded
        if (files.length > 0) {
            // Remove old featured image if new one is uploaded
            if (req.files.some(file => file.fieldname === 'featuredImage') && theBlog.featuredImage) {
                fs.unlink('.' + theBlog.featuredImage, (err) => {
                    if (err) console.error(`Error deleting featured image: ${err.message}`);
                });
            }

            // Remove old content images if they're being replaced
            for (const content of theBlog.data) {
                if (content.type === 'img') {
                    fs.unlink('.' + content.content, (err) => {
                        if (err) console.error(`Error deleting file: ${err.message}`);
                    });
                }
            }
        }

        // Create a map of temporary keys to final URLs
        files.forEach(file => {
            if (file.fieldname === 'featuredImage') {
                fileMap.featuredImage = `/media/${file.filename}`;
            } else {
                fileMap[file.fieldname] = `/media/${file.filename}`;
            }
        });
        
        // Replace temporary keys with actual URLs in the data
        const processedData = data.map(item => {
            if (item.type === 'img') {
                // If content is a key in fileMap, use the new URL, otherwise keep existing URL
                return {
                    ...item,
                    content: fileMap[item.content] || item.content
                };
            }
            return item;
        });

        // Update the blog
        const updateData = {
            title,
            data: processedData,
        };

        // Handle featuredImage update
        if (req.body.featuredImage === 'null') {
            updateData.featuredImage = null;  // Explicitly set to null if no image
        } else if (fileMap.featuredImage) {
            updateData.featuredImage = fileMap.featuredImage;  // Set new image if uploaded
        }

        const blog = await Blog.findOneAndUpdate(
            { _id: blogId, userId: req.user._id },
            updateData,
            { new: true }
        );
        
        if (!blog) {
            return res.status(404).json({ message: "Blog not found or unauthorized" });
        }
        
        res.status(200).json({ message: "Blog edited successfully" });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: "Something went wrong, please try again later" });
    } 
});
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
        deletedBlog.data.map(content=>{
            if(content.type==='img'){
                fs.unlink('.'+content.content,(err)=>{
                    if (err) {
                        console.error(`Error deleting file: ${err.message}`);
                    } else {
                        console.log(`File deleted successfully`);
                    }
                })
            }
        })
        fs.unlink('.'+deletedBlog.featuredImage,(err)=>{
            if (err) {
                console.error(`Error deleting file: ${err.message}`);
            } else {
                console.log(`File deleted successfully`);
            }
        })

        return res.status(200).json({message:"Blog post deleted successfully"})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Something went wrong, please try again later"})
    }
})

app.listen(PORT,()=>{
    console.log("app running");
})
