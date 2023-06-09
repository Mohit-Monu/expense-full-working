const Sequelize=require('sequelize');
const sequelize=require('../database');

const expenses=sequelize.define('forgetpasswordrequests',
{
    id:{
        type:Sequelize.STRING,
        allowNull:false,
        primaryKey:true
    },
    isactive:{
        type:Sequelize.BOOLEAN,
    },
})
module.exports=expenses;