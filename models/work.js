const mongoose=require('mongoose')

const Schema=mongoose.Schema

const workSchema=new Schema({
    work:{
        type:String,
        required:true
    },
    votes:{
        users:[
            {
                userId:{
                    type:Schema.Types.ObjectId,
                    require:true
                }
            }
        ]
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    contestId:{
        type:Schema.Types.ObjectId,
        ref:'Contest',
        required:true
    }
})

workSchema.methods.addVote=function(user){
    
    const votes=this.votes
    let updatedVote=votes
    
    if(!votes.users.length){
       
         updatedVote={users:[{userId:user._id}]}
    }
    const votedUser=votes.users.find((vote)=>vote.userId.toString()===user._id.toString())
    if(votedUser){
       const newVotes=votes.users.filter((vote)=>vote.userId.toString()!==user._id.toString())
       updatedVote={users:newVotes}
    }
    if(!votedUser && votes.users.length){
     
        const newUser={userId:user._id}
        
       
        const a=updatedVote.users.push(newUser)
     }
    this.votes=updatedVote
   return  this.save()
 
}
Work=mongoose.model('Work',workSchema)
module.exports=Work