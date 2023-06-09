const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken');
const USERS = require("../models/user");
const sequelize=require('../database');
require("dotenv").config();

function  generateAccessTocken(id,name){
  return jwt.sign({userId:id,userName:name},process.env.TOKEN)
}

async function login(req, res) {
  try {
    const email1 = await req.body.email;
    var password1 = await req.body.password;
    const search = await USERS.findAll();
    var count = 0;
    await search.forEach((element) => {
      if (element.email == email1) {
        count++;
        bcrypt.compare(password1, element.password, (err, result) => {
          if (result === true) {
            count++;
            console.log("logged in");
            res.status(200).json({message:"logged in successfully",token: generateAccessTocken(element.id,element.name)})

          } else if (result === false) {
            console.log("wrong password");
            res.status(401).json({message:"wrong password"});
          }
        });
      }
    });
    if (count == 0) {
      console.log("wrong email");
      res.status(404).json({message:"User not found"})
    }
  } catch (err) {
    console.log(err);
  }
}
async function adduser(req, res) {
  const t = await sequelize.transaction();

  try {
    const name1 = await req.body.name;
    const email1 = await req.body.email;
    var password1 = await req.body.password;
    const search = await USERS.findAll();
    var count = 0;
    const data1 = { name1, email1, password1 };
    await search.forEach((element) => {
      if (element.email == email1) {
        count++;
        console.log("email already exist")
        res.status(403).json({message:"email exist"})
      }
    });
    if (count == 0) {
      const saltrounds = 10;
      bcrypt.hash(password1, saltrounds, async (err, hash) => {
        password1 = hash;
        if (err) {
          console.log(err);
        }
        const data = await USERS.create({
          name: name1,
          email: email1,
          password: password1,
          total_exp:0,
          
        },{transaction:t}).then(async()=>{
          console.log(name1, email1, password1);
          console.log("updated");
          await t.commit();

        }).catch(async(err)=>{
          await t.rollback();

        })


        res.status(201).json({message:"updated"})
      });
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = { adduser, login};
