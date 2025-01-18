require('dotenv').config()

const DB_URI = process.env.DB_URI
const mongoose = require('mongoose')

const connectToDb = async()=>{
    try{
        const {connection} = await mongoose.connect(DB_URI)
        if(connection.readyState){
            console.log('Connected to DB')
        } 
    }
    catch(err){
        console.log(err)
    }
}

module.exports = connectToDb