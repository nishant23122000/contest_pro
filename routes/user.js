const express=require('express')
const userController=require('../controller/user')

const router=express.Router()

router.get('/',userController.getContest)
router.get('/contest/:contestId',userController.getContestPage)
router.get('/join_contest/:contestId',userController.getJoinContest)
router.post('/join_contest',userController.postJoinContest)
router.get('/live_contest',userController.getLiveContest)
router.get('/add_vote/:workId',userController.addToVotes)
module.exports=router