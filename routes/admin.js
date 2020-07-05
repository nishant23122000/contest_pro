const express=require('express')
const adminController=require('../controller/admin')
const isAuth=require('../middleware/isAuth')
const { check }=require('express-validator/check')
const router=express.Router()

router.get('/create_contest',isAuth,adminController.getCreateContest)
router.post('/create_contest',[
    check('contestName','Content name must be a String').isString(),
    check('contestType','Content Type must be String').isString(),
    check('contestPrice','Content Price must be Numeric').isNumeric(),
    check('contestAgeLimit').custom((val,{req})=>{
        if(parseInt(val)>100 || parseInt(val)<0){
            throw new Error('invalid age')
        }else{
            return true
        }
    }),
    check('description','description require minimum 15 charector').isLength({min:15})
],isAuth,adminController.postCreateContest)

router.get('/your_contest',adminController.getYourContest)
module.exports=router