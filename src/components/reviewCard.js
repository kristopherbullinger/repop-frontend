import React, { Component, Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

const baseurl = "https://res.cloudinary.com/repop/image/upload/v1545005116/"


const reviewCard = props => {
  const { review } = props

  const setPurchasedTime = date => {
    let postedDate = new Date(date)
    let timeNow = new Date()
    let diff = timeNow - postedDate
    if (diff / 1000 / 60 < 1) {
      return `just a few seconds ago`
    } else if (diff / 1000 / 60 / 60 < 1) {
      return `${Math.floor(diff / 1000 / 60)} minutes ago`
    } else if (diff / 1000 / 60 / 60 < 48) {
      return `${Math.floor(diff / 1000 / 60 / 60)} hours ago`
    } else if (diff / 1000 / 60 / 60 / 24 < 31) {
      return `${Math.floor(diff / 1000 / 60 / 60 / 24)} days ago`
    } else if (diff / 1000 / 60 / 60 / 24 / 7 < 52) {
      return `${Math.floor(diff / 1000 / 60 / 60 / 7)} weeks ago`
    } else {
      return `${Math.floor(diff / 1000 / 60 / 60 / 7 / 52)} years ago`
    }
  }

  return (
    <div className="purchaseCard">
      <p>
        <NavLink to={`/user/${props.selectedUser.id}/item/${review.item_id}`}>
          <img src={`${baseurl}user${props.selectedUser.id}item${review.item_id}`} style={{width: 125}}/>
        </NavLink>
      </p>
      <p>{review.rating}/5</p>
      <p>{review.description}</p>
      <p>Purchased By: <NavLink to={`/user/${review.purchaser.id}`}>@{review.purchaser.username}</NavLink></p>
    </div>
  )
}
const mapStateToProps = state => {
  return {
    selectedUser: state.users.selectedUser
  }
}
export default connect(mapStateToProps)(reviewCard)
