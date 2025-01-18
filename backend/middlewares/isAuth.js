require('dotenv').config()
const jwt = require('jsonwebtoken')
const JWT_KEY = process.env.JWT_KEY

const isAuth = (req, res, next)=>{
    const token = req.cookies.authToken
    if(!token){
        res.status(401).json({message:"Access denied"})
    }

    try{
        const decoded = jwt.verify(token,JWT_KEY)
        req.user = decoded
        next()
    }
    catch(err){
        return res.status(403).json({message:'Invalid login information'})
    }
}

module.exports = isAuth