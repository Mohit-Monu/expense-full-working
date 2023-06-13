require("dotenv").config();
const express=require('express')
const cors=require('cors');
const User=require('./models/user')
const Expense=require('./models/expenses')
const Order=require('./models/order')
const Forgetpasswordreq=require('./models/forgetpasswordreq')
const generatedreports=require('./models/generatedreports')
const bodyParser=require('body-parser');
const sequelize=require('./database')
const userRoutes=require('./routes/users')
const expensesRoutes=require('./routes/expenses')
const orderRoutes=require('./routes/purchase')
const premiumRoutes=require('./routes/premium')
const forgetpassRoutes=require('./routes/forgetpass')
const app=express()
app.use(cors())
app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: false  }));
app.use(userRoutes);
app.use(expensesRoutes);
app.use(orderRoutes);
app.use(premiumRoutes);
app.use(forgetpassRoutes);
User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(Forgetpasswordreq);
Forgetpasswordreq.belongsTo(User);
User.hasMany(generatedreports);
generatedreports.belongsTo(User);
sequelize.sync(
    // {force:true}
)
.then((res)=>{
    app.listen(process.env.PORT);
}).catch((err)=>{
    console.log(err);
})