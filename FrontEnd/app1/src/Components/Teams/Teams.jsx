import React from 'react'
import TeamsCard from '../TeamsCard/TeamsCard'

const Teams = ({data}) => {
const players = data.map((player)=>{
  return(
    <TeamsCard key={player.id} {...player} />
    
  )
})
console.log(players)

  return (
    <>
    <div className="teams">
      {players}
      </div> 
    </>
  )
}

export default Teams
