import React from 'react'
import { NavLink } from 'react-router-dom'


const itemCard = ({item}) => {
  console.log(item)
  return (
    <a href={`/user/${item.user_id}/item/${item.id}`}>
      <div className="itemcard">
        <img src={item.imgsrc} alt="noimgsrc"/>
        <p>Price: {item.price}</p>
      </div>
    </a>
  )
}

export default itemCard
