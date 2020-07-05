
function addToVote(btn,st){
  
  const workId=btn.parentNode.querySelector('[name=workId]').value
  if(st=='Your Votes:'){
    var status=document.querySelector(".votes")
  }
  
    var btn=document.getElementById("bt")
   votes=document.getElementById("votes")
    var vote=parseInt(votes.innerText)
  
    if(btn.classList.contains("far")){
      btn.classList.remove("far")
      btn.classList.add("fas")
     
      vote=vote+1
      if(st=='Your Votes:')
      {
        status.innerText=vote
      }
      console.log('far')
      votes.innerText=vote
    }else{
      btn.classList.remove("fas")
      btn.classList.add("far")
      console.log('fas')
      vote=vote-1
      if(st=='Your Votes:')
      {
        status.innerText=vote
      }
      votes.innerText=vote
      
    }
    fetch('/add_vote/'+workId,{
        method:'GET'
    }).then((result)=>{
        return result.json()
    }).then((data)=>{
        console.log(data)
    }).catch((error)=>{
        console.log(error)
    })
    
  }
  