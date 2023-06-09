const sequelize = require("../database");
const Expenses = require("../models/expenses");
const USERS = require("../models/user");

async function showleaderboard(req, res, next) {
  try {

    const user = await USERS.findAll({
        attributes:['name','total_exp'],
        order:[['total_exp','DESC']]
    });

    res.status(200).json({user})

  } catch (err) {
    console.log(err);
  }
}

module.exports = { showleaderboard };
