const expenses = require("../models/expenses");
const USERS = require("../models/user");
const sequelize = require("../database");

async function addexpense(req, res) {
  const t = await sequelize.transaction();
  try {
    const amount = req.body.amt;
    const description = req.body.des;
    const category = req.body.cat;
    const id = req.user.id;
    await expenses.create(
      {
        expenseamount: amount,
        category: category,
        description: description,
        userId: id,
      },
      { transaction: t }
    );
    const user = await USERS.findOne({ where: { id: id } });
    const exp = user.total_exp;
    await user.update({ total_exp: exp + amount / 1 }, { transaction: t });
    await t.commit();
    res.status(200).json({ message: "expenses uploaded" });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: "Some thing went wrong " });
  }
}
async function loadexpense(req, res) {
  try{
    var page = req.params.page;
    page = page / 1;
    var limit = req.params.limit || 5;
    limit = limit / 1;
    const noofexp = await expenses.count({ where: { userId: req.user.id } });
    const search = await expenses.findAll({
      where: { userId: req.user.id },
      offset: (page - 1) * limit,
      limit: limit,
      order: [["id", "DESC"]],
    });
    const user1 = await USERS.findOne({ where: { id: req.user.id } });
    res.status(202).json({
      result: search,
      user: user1,
      pagination: {
        lastpage: Math.ceil(noofexp / limit),
      },
    }); 
  }catch{
    res.status(500).json({ message: "Some thing went wrong " });
  }
}
async function delexpenses(req, res) {
  try {
    const t = await sequelize.transaction();
    const id1 = req.params.id;
    var amount = 0;
    const deletedExpense = await expenses.findOne(
      { where: { id: id1 } }
    );
    amount = deletedExpense.expenseamount;
    await deletedExpense.destroy({ transaction: t });
    const user = await USERS.findOne({ where: { id: req.user.id } });
    const exp = user.total_exp;
    await user.update({ total_exp: exp - amount / 1 },{transaction:t});
    await t.commit();
    res.status(200).json({ message:"deleted" });
  } catch {
    await t.rollback();
    res.status(500).json({ message: "Some thing went wrong " });
  }
}
module.exports = { addexpense, loadexpense, delexpenses };
