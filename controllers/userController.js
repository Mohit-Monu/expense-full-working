const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const USERS = require("../models/user");
const sequelize = require("../database");
require("dotenv").config();

function generateAccessToken(id, name) {
  return jwt.sign({ userId: id, userName: name }, process.env.TOKEN);
}
async function login(req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await USERS.findOne({ where: { email: email } });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          console.log("logged in");
          res.status(200).json({
            message: "Logged in successfully",
            token: generateAccessToken(user.id, user.name),
          });
        } else {
          console.log("wrong password");
          res.status(401).json({ message: "Wrong password" });
        }
      });
    } else {
      console.log("User not found");
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.log("Something went wrong");
    res.status(500).json({ message: "Something went wrong" });
  }
}
async function adduser(req, res) {
  const t = await sequelize.transaction();
  try {
    const name1 = await req.body.name;
    const email1 = await req.body.email;
    var password1 = await req.body.password;
    const search = await USERS.findOne({ where: { email: email1 } });
    if (search) {
      console.log("email already exist");
      res.status(403).json({ message: "email exist" });
    } else {
      const saltrounds = 10;
      bcrypt.hash(password1, saltrounds, async (err, hash) => {
        password1 = hash;
        if (err) {
          res.status(500).json({ message: "Something went wrong" });
        } else {
          await USERS.create(
            {
              name: name1,
              email: email1,
              password: password1,
              total_exp: 0,
            },
            { transaction: t }
          );
          await t.commit();
          res.status(201).json({ message: "updated" });
        }
      });
    }
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: "Something went wrong" });
  }
}
module.exports = { adduser, login };
