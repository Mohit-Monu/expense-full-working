const Sib = require("sib-api-v3-sdk");
const Forgetpass = require("../models/forgetpasswordreq");
const USERS = require("../models/user");
const path = require("path");

const { v4: uuidv4 } = require("uuid");

require("dotenv").config();
async function resetpass(req, res) {
  await USERS.findAll({ where: { email: req.params.email } }).then((user) => {
    if (user.length != 0) {
      const client = Sib.ApiClient.instance;
      const apiKey = client.authentications["api-key"];
      apiKey.apiKey = process.env.API_KEY;
      const tranEmailApi = new Sib.TransactionalEmailsApi();
      const sender = {
        email: "bmohit700@gmail.com",
      };
      const uuid = uuidv4();
      const receivers = [
        {
          email: req.params.email,
        },
      ];
      tranEmailApi
        .sendTransacEmail({
          sender,
          to: receivers,
          subject: "Reset your password from here",
          textContent:
            "We have requested to reset your password from expense tracker click on the below link to reset http://localhost:3000/password/resetpassword/" +
            uuid,
        })
        .then(async () => {
          await Forgetpass.create({
            id: uuid,
            isactive: true,
            userId: user[0].id,
          });
          res.status(200).json({ message: "email sent " });
        })
        .catch((err) => {
          console.log("Error in sending email");
          res.status(500).json({ message: "cant send email " });
        });
    } else {
      res.status(404).json({ message: "Email not found" });
    }
  });
}
async function uuidvalidater(req, res) {
  try {
    const id = req.params.uuid;
    await Forgetpass.findAll({ where: { id: id } }).then((user) => {
      if (user.length != 0) {
        if(user[0].isactive==true){
          res.sendFile(path.join(__dirname, "../", "/main", "/resetpass.html"));

        }else{
          res.sendFile(path.join(__dirname, "../", "/main", "/404.html"));
        }
      } else {
        res.sendFile(path.join(__dirname, "../", "/main", "/404.html"));
      }
    });
  } catch (err) {
    console.log(err);
  }
}
async function createpass(req,res){

}
module.exports = { resetpass, uuidvalidater,createpass };
