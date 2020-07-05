const mongoose=require('mongoose')

const Schema=mongoose.Schema

const contestSchema=new Schema({
    contestName:{
        type:String,
        required:true
    },
    contestType:{
        type:String,
        required:true
    },
    contestPrice:{
        type:Schema.Types.Number,
        required:true
    },
    contestPoster:{
        type:String,
        required:true
    },
    contestAgeLimit:{
        type:Number,
        required:true
    },
    contestLowTime:{
        type:String,
        required:true
    },
    contestHighTime:{
        type:String,
        required:true
    },
    contestResultTime:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    createdUser:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    participant:
        {
            users:[
                {
                userId:{
                    type:Schema.Types.ObjectId,
                    required:true
                },
                workSubmitted:{
                    type:Boolean,
                    required:true
                }
            }
            ]
        }
    

})

contestSchema.methods.getParticipant=function(user){
    let participant=this.participant
    let updatedParticipant=participant
    if(!participant.users.length){
        updatedParticipant={users:[{userId:user._id,workSubmitted:false}]}
     
       
    }else{
       if(!(participant.users.find((p)=>p.userId.toString()===user._id.toString()))){
        newParticipant={userId:user._id,workSubmitted:false}
     
          updatedParticipant.users.push(newParticipant)
          
         
       }
     
        
        
    }
   
    this.participant=updatedParticipant
    return this.save()
}

Contest=mongoose.model('Contest',contestSchema)
module.exports=Contest