const Razorpay=require('razorpay');
const Order = require("../models/order");
require("dotenv").config();

function buymembership(req,res){
    var rzp=new Razorpay({
        key_id:process.env.RAZORPAY_KEY_ID,
        key_secret:process.env.RAZORPAY_KEY_SECRET
    })
    const amount=25000;
    rzp.orders.create({amount,currency:"INR"},(err,order)=>{
        if(err){
            throw new Error (JSON.stringify(err));
        }else{
            req.user.createOrder({orderid:order.id,status:"PENDING"}).then(()=>{
                res.status(201).json({order,key_id:rzp.key_id})

            }).catch((err)=>{
                console.log(err)
            })
        }
    })
} 
async function updatetransaction(req,res){
    try{
        const {payment_id,order_id}=req.body;
        Order.findOne({where:{orderid:order_id}}).then(order=>{
            order.update({payment_id:payment_id,status:"Successfull"}).then(()=>{
                
                req.user.update({isPremiumUser:true}).then(()=>{
                    return res.status(202).json({success:true,message:"Transaction Successful"})
                }).catch((err)=>{
                    throw new Error(err);
                })
            })
        })

    }catch(err){
        throw new Error(err);
    }

}


module.exports={buymembership,updatetransaction}