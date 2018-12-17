import React from 'react'
import { NavLink } from 'react-router-dom'
import tshirtimg from '../images/tshirt.jpg'
import errorImg from '../images/error.jpg'


const itemCard = ({item}) => {

  const imgError = (e) => {
    e.target.onerror = "";
    e.target.src = errorImg
    return true
  }
  // <img src={`${baseurl}/user${item.user.id}item${item.id}.jpg`} alt="noimgsrc" onerror="this.onerror=null;this.src={errorImg};"/>


  const baseurl = "https://res.cloudinary.com/repop/image/upload/v1545005116/"
  return (
    <NavLink to={`/user/${item.user.id}/item/${item.id}`}>
      <div className="itemcard">
      <img src={`${baseurl}/user${item.user.id}item${item.id}.jpg`} alt="noimgsrc" onError={(e)=>{e.target.onerror = null; e.target.src=errorImg}}/>
        <p>${item.price}</p>
      </div>
    </NavLink>
  )
}

export default itemCard
