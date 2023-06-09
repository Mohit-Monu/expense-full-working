const expenses = require("../models/expenses");
const USERS = require("../models/user");
const sequelize=require('../database')

async function addexpense(req,res){
  const t = await sequelize.transaction();
    try{
      const amount=req.body.amt;
      const description=req.body.des;
      const category=req.body.cat;
      const id=req.user.id;

      await expenses.create({
        expenseamount:amount,
        category:category,
        description:description,
        userId:id,
      },{transaction:t})
      await USERS.findOne({where:{id:id}},{transaction:t}).then((user)=>{
        const exp=user.total_exp
        user.update({total_exp:exp+amount/1},{transaction:t}).then(async(ans)=>{
          await t.commit();

        }).catch(async(err)=>{
          await t.rollback();
          res.status(500).json({data:err})
        })
      })
      res.send("expenses uploaded")
    }catch   ( err){
      await t.rollback()
      console.log(err);
    }
  }
  async function loadexpense(req,res){
    const search = await expenses.findAll({where:{userId:req.user.id}})
    const user1=await USERS.findAll({where:{id:req.user.id}})
    res.status(202).json({result:search,user:user1})
  }
  async function delexpenses(req,res){
  const t = await sequelize.transaction();
    const id1=req.params.id;
    var amount=0;
    await expenses.findOne({where:{id:id1}},{transaction:t}).then((deletedExpense)=>{
      amount=deletedExpense.expenseamount;
      deletedExpense.destroy()
    }).catch(async(err)=>{
      await t.rollback()
      res.status(500).json({data:err})
      
    })
    await USERS.findOne({where:{id:req.user.id}}).then(async(user)=>{
      const exp=user.total_exp
      user.update({total_exp:exp-amount/1}).then(async()=>{
        await t.commit();

      }).catch(async(err)=>{
        await t.rollback()
        res.status(500).json({data:err})
      })
    })
    .catch(async(err)=>{
      await t.rollback()
      res.status(500).json({data:err})
    })
    res.send("deleted");
  }
  module.exports = {addexpense,loadexpense,delexpenses };