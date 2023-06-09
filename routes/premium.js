const express=require('express')
const premiumcontroller=require('../controllers/premiumcontroller')
const userAuthentication=require('../middleware/authorization')

const router=express.Router();

router.get('/premium/showleaderboard',userAuthentication.authenticate,premiumcontroller.showleaderboard);

module.exports=router;