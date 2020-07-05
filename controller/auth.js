const User=require('../models/user')
const bcrypt=require('bcrypt')
const {validationResult}=require('express-validator/check')
const nodeMailer=require('nodemailer')

const transport=nodeMailer.createTransport({
    service:'gmail',
    auth:{
        user:'email',
        pass:'password'
    }
})

exports.getLogin=(req,res,next)=>{
    res.render('auth/login',{
        path:'login',
        pageTitle:'login',
        error:req.flash('popup'),
        oldData:{
            
            'email':'',
            'password':'',
            
        },
        validationError:[]
    })
}

exports.postLogIn=(req,res,next)=>{
    
    const email=req.body.email
    const password=req.body.password

    const error=validationResult(req)
    console.log(error)
    if(!error.isEmpty()){
       return  res.render('auth/login',{
            path:'/login',
            pageTitle:'login',
            error:error.array()[0].msg,
            oldData:{
                
                'email':email,
                'password':password
                
            },
            validationError:error.array()
        })
    }

    User.findOne({email:email}).then((user)=>{
        if(!user){
            req.flash('popup','User have no account')
         
            return res.redirect('/login')
        }
        bcrypt.compare(password,user.password).then((isTrue)=>{
            if(!isTrue){
                req.flash('popup','password incorrect!')
                
                return res.redirect('/login')
            }
          
            req.session.isLoggedIn=true
            req.session.user=user
            return req.session.save((err)=>{
            
                res.redirect('/')
            })

        }).then(()=>{
            console.log("user Logged IN!")
        }).catch((error)=>{
            console.log(error)
        })
    })
 
}

exports.getSignUp=(req,res,next)=>{

    res.render('auth/signup',{
        path:'signup',
        pageTitle:'signup',
        error:req.flash('popup'),
        oldData:{
            'username':'',
            'email':'',
            'password':'',
            'confirmPassword':''
        },
        validationError:[]
    })
}

exports.postSignUp=(req,res,next)=>{
    const username=req.body.username
    const email=req.body.email
    const password=req.body.password
    const confirmPassword=req.body.confirmPassword
    const error=validationResult(req)
   
    if(!error.isEmpty()){
        return res.render('auth/signup',{
            path:'/signup',
            pageTitle:'signup',
            error:error.array()[0].msg,
            oldData:{
                'username':username,
                'email':email,
                'password':password,
                'confirmPassword':confirmPassword
            },
            validationError:error.array()
            
        })
    }
    User.findOne({email:email}).then((user)=>{
        if(user){
            req.flash('popup','Email Id already exist')
            
          return  res.redirect('/signup')
        }
        bcrypt.hash(password,15).then((hashedPassword)=>{
            const user=User({
                username:username,
                email:email,
                password:hashedPassword
            })
            return user.save()
        }).then(()=>{
            console.log('USER SIGNNED UP!')
            res.redirect('/login')
            return transport.sendMail({
                from:'your email',
                to:email,
                subject:'Signup SuccessFully',
                text:'Welcome to nik contest site,thanks for joining💕'
            }).catch((error)=>{
                console.log(error)
            })
           
        }).catch((error)=>{
            console.log(error)
        })

    })
}


exports.getLogOut=(req,res,next)=>{
    req.session.destroy(()=>{
        res.redirect('/login')
    })
}