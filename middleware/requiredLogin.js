const jwt = require('jsonwebtoken')

const User = require("../models/Users");
const dotenv = require('dotenv');
// Load env vars
dotenv.config({ path: './config/config.env' });

const jwtkey  = "" + process.env.JWT_KEY


module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    //authorization === Bearer ewefwegwrherhe
    if(!authorization){
       return res.status(401).json({error:"you must be logged in"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,jwtkey,(err,payload)=>{
        if(err){
         return   res.status(401).json({error:"you must be logged in"})
        }

        const {_id} = payload
        User.findById(_id).then(userdata=>{
            req.user = userdata
            next()
        })
        
        
    })
}