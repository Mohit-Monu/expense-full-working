const Sib = require("sib-api-v3-sdk");
const Forgetpass = require("../models/forgetpasswordreq");
const USERS = require("../models/user");
const sequelize = require("../database");

const path = require("path");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
async function resetpass(req, res) {
  const t = await sequelize.transaction();

  try {
    const user = await USERS.findOne({ where: { email: req.params.email } });
    if (user) {
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
      tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: "Reset your password from here",
        textContent:
          "We have requested to reset your password from expense tracker click on the below link to reset http://3.80.151.107/password/resetpassword/" +
          uuid,
      });
      const done = await Forgetpass.create(
        {
          id: uuid,
          isactive: true,
          userId: user.id,
        },
        { transaction: t }
      );
      if (done) {
        await t.commit();
        res.status(200).json({ message: "email sent " });
      }
    } else {
      res.status(404).json({ message: "Email not found" });
    }
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: "Some thing went wrong " });
  }
}
async function uuidvalidater(req, res) {
  try {
    const id = req.params.uuid;
    const user = await Forgetpass.findOne({ where: { id: id } });
    if (user) {
      if (user.isactive == true) {
        res.sendFile(path.join(__dirname, "../", "/main", "/resetpass.html"));
      } else {
        res.sendFile(path.join(__dirname, "../", "/main", "/404.html"));
      }
    } else {
      res.sendFile(path.join(__dirname, "../", "/main", "/404.html"));
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong " });
  }
}
async function createpass(req, res) {
  const t = await sequelize.transaction();
  try {
    const uuid = req.body.uuid;
    var newpass = req.body.newpass;
    const user = await Forgetpass.findOne({ where: { id: uuid } });
    await user.update({ isactive: false }, { transaction: t });
    const user1 = await USERS.findOne({ where: { id: user.userId } });
    const saltrounds = 10;
    const hashpass=await bcrypt.hash(newpass, saltrounds)
    await user1.update({ password: hashpass }, { transaction: t });
    await t.commit();
      res.status(200).json({ message: "password changed successfully" });
  } catch (err) {
    await t.rollback();
    console.log(err)
    res.status(500).json({ message: "Something went wrong " });
  }
}
module.exports = { resetpass, uuidvalidater, createpass };
