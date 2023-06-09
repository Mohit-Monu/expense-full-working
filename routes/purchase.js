const express=require('express')
const purchasecontroller=require('../controllers/purchasecontroller')
const userAuthentication=require('../middleware/authorization')

const router=express.Router();

router.get('/purchase/membership',userAuthentication.authenticate,purchasecontroller.buymembership);
router.post('/purchase/updatetransaction',userAuthentication.authenticate,purchasecontroller.updatetransaction);



module.exports=router;