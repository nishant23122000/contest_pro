const express=require('express')
const errorController=require('../controller/error')
const router=express.Router()

router.get('/500',errorController.get500)
router.use(errorController.get404)

module.exports=router