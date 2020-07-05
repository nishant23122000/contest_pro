


exports.get404=(req,res,next)=>{
    res.render('404',{
        path:'contest',
        pageTitle:'Page Not Found'
    })
}
exports.get500=(req,res,next)=>{
    res.status(500).render('500',{
        pageTitle:'Error!',
        path:'/500',
        isAuth:req.session.isLoggedIn
    })
}