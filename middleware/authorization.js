const jsw=require('jsonwebtoken');
const User=require('../models/user');
require("dotenv").config();
async function authenticate(req,res,next){
    try{
        const token=req.header('Authorization');
        const user= jsw.verify(token,process.env.TOKEN);
        await User.findByPk(user.userId).then(user=>{
            req.user=user
            next()
        })
    }catch(err){
        console.log(err);
        return res.status(401).json({success:false})
    }
}
module.exports={authenticate}