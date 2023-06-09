const express=require('express')
const forgetpasscontroller=require('../controllers/forgetpasscontroller')

const router=express.Router();

router.post('/password/forgotpassword/:email',forgetpasscontroller.resetpass);
router.get('/password/resetpassword/:uuid',forgetpasscontroller.uuidvalidater);
router.post('/password/createpass',forgetpasscontroller.createpass);


module.exports=router;