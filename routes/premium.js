const express=require('express')
const premiumcontroller=require('../controllers/premiumcontroller')
const userAuthentication=require('../middleware/authorization')

const router=express.Router();

router.get('/premium/showleaderboard',userAuthentication.authenticate,premiumcontroller.showleaderboard);
router.get('/premium/downrep',userAuthentication.authenticate,premiumcontroller.downloadrep);
router.get('/premium/downgenerep',userAuthentication.authenticate,premiumcontroller.downgenerep);

module.exports=router;