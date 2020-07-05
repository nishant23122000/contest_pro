const express=require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const session=require('express-session')
const flash=require('connect-flash')
const MongoDbSession=require('connect-mongodb-session')(session)
const path=require('path')

const User=require('./models/user')

const MONGODB_URL='Your MongoDb URL'
const userRoute=require('./routes/user')
const adminRoute=require('./routes/admin')
const errorRoute=require('./routes/error')
const authRoute=require('./routes/auth')



const app=express()

const store=new MongoDbSession({
    collection:'sessions',
    uri:MONGODB_URL
})

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'./public')))
app.use(session({secret:'nishant',saveUninitialized:false,resave:false,store:store}))
app.set('view engine','ejs')
app.set('views','views')
app.use(flash())
app.use((req,res,next)=>{
    if(!req.session.user){
         return next()
    }
    User.findOne(req.session.user._id).then((user)=>{
       req.user=user
       next()
    })
})

app.use((req,res,next)=>{
    res.locals.isAuth=req.session.isLoggedIn
    next()
})

app.use(authRoute)
app.use(userRoute)
app.use(adminRoute)
app.use(errorRoute)

mongoose.connect(MONGODB_URL,{useNewUrlParser:true,useUnifiedTopology:true},()=>{
    app.listen(3000,()=>{
        console.log('Server started on port 3000!')
    })
})

