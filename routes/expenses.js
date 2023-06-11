const express=require('express')
const expensecontroller=require('../controllers/expensescontroller')
const userAuthentication=require('../middleware/authorization')

const router=express.Router();

router.post('/expenses/user',userAuthentication.authenticate,expensecontroller.addexpense);
router.get('/expenses/load/:page/:limit',userAuthentication.authenticate,expensecontroller.loadexpense);
router.delete('/expenses/del/:id',userAuthentication.authenticate,expensecontroller.delexpenses);

module.exports=router;