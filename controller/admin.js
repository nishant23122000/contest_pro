const Contest=require('../models/contest')
const mongoose=require('mongoose')
const { validationResult }=require('express-validator/check')

exports.getCreateContest=(req,res,next)=>{
    res.render('admin/create_contest',{
        path:'create_contest',
        pageTitle:'create_contest',
        error:[],
        oldData:{
            'contestName':'',
            'contestType':'',
            'contestPrice':'',
            'contestPoster':'',
            'contestLowTime':'',
            'contestHighTime':'',
            'contestResultTime':'',
            'contestAgeLimit':'',
            'discription':''

        },
        validationError:[]
    })
}

exports.postCreateContest=(req,res,next)=>{
    
    const contestName=req.body.contestName
    const contestType=req.body.contestType
    const contestPrice=req.body.contestPrice
    const contestPoster=req.body.contestPoster
    const contestLowTime=req.body.contestLowTime
    const contestHighTime=req.body.contestHighTime
    const contestResultTime=req.body.contestResultTime
    const contestAgeLimit=req.body.contestAgeLimit
    const description=req.body.description
    const error=validationResult(req)
    
    if(!error.isEmpty()){
        return res.render('admin/create_contest',{
            path:'create_contest',
            pageTitle:'create_contest',
            error:error.array()[0].msg,
            oldData:{
                'contestName':contestName,
                'contestType':contestType,
                'contestPrice':contestPrice,
                'contestPoster':contestPoster,
                'contestLowTime':contestLowTime,
                'contestHighTime':contestHighTime,
                'contestResultTime':contestResultTime,
                'contestAgeLimit':contestAgeLimit,
                'discription':description

            },
            validationError:error.array()
        })
    }
    const contest=new Contest({
        // _id:new mongoose.Types.ObjectId('dfsdfd'),
        contestName:contestName,
        
        contestType:contestType,
        contestPrice:contestPrice,
        contestPoster:contestPoster,
        contestAgeLimit:contestAgeLimit,
        contestLowTime:contestLowTime,
        contestHighTime:contestHighTime,
        contestResultTime:contestResultTime,
        description:description,
        createdUser:req.user,
    })
    contest.save().then(()=>{
        console.log('CONTEST SAVED SUCCESSFULLY!')
    }).catch((error)=>{
        console.log('error')
        res.redirect('/500')
    })
    
    res.redirect('/')
}

exports.getYourContest=(req,res,next)=>{
    Contest.find({createdUser:req.user._id.toString()}).populate('createdUser').then((contests)=>{
       
        res.render('user/contests',{
            path:'your_contest',
            pageTitle:'YourContests',
            contests:contests,
            error:req.flash('popup'),
            live:false,
            own:true
        })
    })
}