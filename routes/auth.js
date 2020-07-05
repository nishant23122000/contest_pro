const express=require('express')
const authController=require('../controller/auth')
const { check }=require('express-validator/check')

const router=express.Router()

router.get('/login',authController.getLogin)
router.post('/login',[
    check('email','Please Enter Valid Email Address').isEmail(),
    
   
],authController.postLogIn)
router.get('/signup',authController.getSignUp)
router.post('/signup',[
   check('username').custom((val,{req})=>{
       if(!val){
           throw new Error('username required!')
       }
       return true
   }),
    check('email','Please Enter Valid Email Address').isEmail(),
    check('password','password length must be greater then 5').isLength({min:5}),
    check('confirmPassword').custom((value,{req})=>{
        if(value!==req.body.password){
            throw new Error('Password Confirmation is inCorrect')
        }
        return true
    })
],authController.postSignUp)
router.get('/logout',authController.getLogOut)

module.exports=router