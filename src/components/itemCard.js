import React from 'react'
import { NavLink } from 'react-router-dom'
import errorImg from '../images/error.jpg'


const itemCard = ({item}) => {
  const baseurl = "https://res.cloudinary.com/repop/image/upload/v1545005116/"
  return (
    <NavLink to={`/user/${item.user.id}/item/${item.id}`}>
      <div className={"itemcard" + (!!item.purchase ? " sold" : "")}>
      <img src={`${baseurl}/user${item.user.id}item${item.id}.jpg`} alt="noimgsrc" onError={(e)=>{e.target.onerror = null; e.target.src=errorImg}}/>
      {!!item.purchase ? <div className="centered">SOLD</div> : null}
        <p>${item.price}</p>
      </div>
    </NavLink>
  )
}

export default itemCard
