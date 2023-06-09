const Sequelize=require('sequelize');
const sequelize=require('../database');

const expenses=sequelize.define('expenses',
{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    expenseamount:{
        type:Sequelize.STRING
    },
    category:{
        type:Sequelize.STRING,
    },
    description:{
        type:Sequelize.STRING
    }
})
module.exports=expenses;