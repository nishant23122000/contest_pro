const Contest=require('../models/contest')
const Work=require('../models/work')
exports.getContest=(req,res,next)=>{
    Contest.find().populate('createdUser').then((contest)=>{
        const contests=contest.filter((c)=>{
            
            var countDownDate = new Date(c.contestResultTime).getTime();
            var now = new Date().getTime();
            var distance = countDownDate - now;
            
            if(distance>0){
                return c
            }
  
        })
       
        res.render('user/contests',{
            path:'contest',
            pageTitle:'contests',
            contests:contests,
            live:false,
            own:false,
            error:req.flash('popup')
        })
    })
   
}

exports.getContestPage=(req,res,next)=>{
    let status;
    var vote;
    
    var work,bug;
    const contestId=req.params.contestId
    if(req.user){
        Work.findOne({userId:req.user._id.toString()})
        .then((work)=>{
            if(work)
            {
                vote=work.votes.users.length
            }
            
            
        })
        .catch((error)=>{
            console.log(error)
        })
        Work.find({contestId:contestId})
        .populate('userId')
        .then((works)=>{
            work=works
           
        })
        .catch((error)=>{
            console.log(error)
        })
    }
  
    Contest.findOne({_id:contestId}).populate('createdUser participant')
    .then((contest)=>{
        if(req.session.user){
            const user=contest.participant.users
            .find((p)=>p.userId.toString()===req.user._id.toString())
            
        if(!user){
            status='join'
        }else{
            if(!user.workSubmitted){
                status='submit your work'
            }else{
                status='Your Votes:'
            }
        }
        }else{
            status='join'
        }
        if(!work){
            bug=work
           }else{
               bug=work.length
           }
        res.render('user/contest',{
            pageTitle:contest.contestName,
            path:'contest',
            contest:contest,
            status:status,
            works:work,
            bug:bug,
            man:req.user._id,
            votes:vote
            
        })
      
       
    })
    .catch((error)=>{
        console.log(error)
    })
    
}

exports.getJoinContest=(req,res,next)=>{
    const contestId=req.params.contestId
   
    if(!req.session.isLoggedIn){
        req.flash('popup','please Login to Participate')
        return res.redirect('/login')
    }
    Contest.findById({_id:contestId}).populate('participant').then((contest)=>{
        var contestLowtime = new Date(contest.contestLowTime).getTime();
        var contestHighTime=new Date(contest.contestHighTime).getTime()
        var now = new Date().getTime();
        const user=contest.participant.users
        .find((p)=>p.userId.toString()===req.user._id.toString())

       if(!((contestHighTime-now)>0)){
           req.flash('popup','Submission Time is Over')
        return res.redirect('/')
       }
      if(user){
        if(!((contestHighTime-now)>0 && (now-contestLowtime)>0)){
            var clt = new Date(contest.contestLowTime).toLocaleTimeString()
            var cht=new Date(contest.contestHighTime).toLocaleTimeString()
            const zone1=clt.split(" ")[1]
            const zone2=cht.split(" ")[1]
            const time1=clt.split(":")[0]+':'+clt.split(":")[1]
            const time2=cht.split(":")[0]+':'+cht.split(":")[1]
            var msg='please come between'+' '+time1+' '+zone1+' to '+' '+time2+' '+zone2
            req.flash('popup',msg)
            return res.redirect('/')
            }
        
      }
      
        res.render('user/join',{
            path:'contest',
            pageTitle:'join',
            contestId:contestId,
            user:user,
            email:req.user.email
        })
        
    })
}
exports.postJoinContest=(req,res,next)=>{
    const name=req.body.name
    const email=req.body.email
    const age=req.body.age
    const contestId=req.body.contestId
    const image=req.body.image

    Contest.findById({_id:contestId}).populate('participant').then((contest)=>{
        const user=contest.participant.users
        .find((p)=>p.userId.toString()===req.user._id.toString())
      
        if(!user){
           
            if(age<contest.contestAgeLimit){
                const msg='age must be greater then'+' '+contest.contestAgeLimit+' '+'to participate'
                req.flash('popup',msg)
                return res.redirect('/')
            }
           return contest.getParticipant(req.user).then(()=>{
               const msg='you successfully Joined '+contest.contestName+' contest'
             
               req.flash('popup',msg)
                res.redirect('/')
            }) 
            
        }else{
            if(!user.workSubmitted)
            {
                const work=new Work({
                    work:image,
                    votes:0,
                    userId:req.user,
                    contestId:contestId
                })
               return  work.save().then(()=>{
                    user.workSubmitted=true
                    return contest.save()
                    
                }).then(()=>{
                    req.flash('popup','work submitted successfully')
                    res.redirect('/')
                }).catch((error)=>{
                    console.log(error)
                })
            }
            
        }
        
       
       

    })
    

}

exports.getLiveContest=(req,res,next)=>{
    Contest.find().populate('createdUser').then((contest)=>{
        const contests=contest.filter((c)=>{
            
            var contestLowTime = new Date(c.contestLowTime).getTime();
            var contestHighTime = new Date(c.contestHighTime).getTime();
            var now = new Date().getTime();
          
           
            if(((contestHighTime-now)>0 && (now-contestLowTime)>0)){
                return c
            }
  
        })
        
        res.render('user/contests',{
            path:'live_contest',
            pageTitle:'liveContests',
            contests:contests,
            error:req.flash('popup'),
            live:true,
            own:false
        })
    })
   
}

exports.addToVotes=(req,res,next)=>{
   
   
    const workId=req.params.workId
    console.log(workId)
    
        Work.findById({_id:workId}).then((work)=>{
           
           return work.addVote(req.user)
        }).then(()=>{
            res.status(200).json({message:'vote added'})
        }).catch((error)=>{
            console.log(error)
        })
 
    
   
}