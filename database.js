const Sequelize=require('sequelize');
const sequelize=new Sequelize(
    'sign_up',
    'root',
    'Mohit@12345',
    {
        dialect:'mysql',
        host:'localhost'
    }
);
module.exports=sequelize;
