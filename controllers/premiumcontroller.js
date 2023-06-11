const sequelize = require("../database");
const Expenses = require("../models/expenses");
const GENERATEDREPORTS = require("../models/generatedreports");
const USERS = require("../models/user");
const AWS = require("aws-sdk");
require("dotenv").config();
async function showleaderboard(req, res, next) {
  try {
    const user = await USERS.findAll({
      attributes: ["name", "total_exp"],
      order: [["total_exp", "DESC"]],
    });

    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
  }
}
async function downloadrep(req, res) {
  const exp = await req.user.getExpenses();
  const stringexp = JSON.stringify(exp);
  const userId=req.user.id
  const filename = 'Expense'+userId+'/'+new Date()+'.txt';
  const fileURl = await uploadToS3(stringexp, filename);
  const data = await GENERATEDREPORTS.create({
    userId:userId,
    url:fileURl,
    filename:filename
  });
  res.status(200).json({ fileURl,exp, success: true });
}
function uploadToS3(data, filename) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });
    var params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL:"public-read"
    };
    return new Promise((resolve,reject)=>{
      s3bucket.upload(params,(err,response)=>{
        if(err){
          console.log(err);
          reject(err)
        }else{
          resolve(response.Location)
        }
      })
    })

}
async function downgenerep(req,res){
  const search = await GENERATEDREPORTS.findAll({where:{userId:req.user.id}})
  res.status(200).json({search,message:"list is here"})

}
module.exports = { showleaderboard, downloadrep,downgenerep };
