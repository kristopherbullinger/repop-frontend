import React from 'react'
import { NavLink } from 'react-router-dom'
import tshirtimg from '../images/tshirt.jpg'


const itemCard = ({item}) => {
  return (
    <NavLink to={`/user/${item.user.id}/item/${item.id}`}>
      <div className="itemcard">
        <img src={tshirtimg} alt="noimgsrc"/>
        <p>Price: {item.price}</p>
      </div>
    </NavLink>
  )
}

export default itemCard
