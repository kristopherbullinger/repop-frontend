import React, { Component, Fragment } from 'react'
import { NavLink } from 'react-router-dom'

const baseurl = "https://res.cloudinary.com/repop/image/upload/v1545005116/"


const purchaseCard = props => {
  const { purchase, selectPurchase, cancel } = props

  const setPurchasedTime = date => {
    console.log(purchase)
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

  const displayRating = () => {
    if (purchase.review) {
      let width = `${purchase.rating / 5 * 100}%`
      return (<div className="stars-outline">
        <span>&#9734;</span>
        <span>&#9734;</span>
        <span>&#9734;</span>
        <span>&#9734;</span>
        <span>&#9734;</span>
        <div className="stars-full" style={{width: width}}>
          <span>&#9733;</span>
          <span>&#9733;</span>
          <span>&#9733;</span>
          <span>&#9733;</span>
          <span>&#9733;</span>
        </div>
      </div>)
    } else return (<p>You have not reviewed this item</p>)
  }

  return (
    <div className="purchaseCard">
      <p className="purchasecard-img">
        <NavLink to={`/user/${purchase.seller.id}/item/${purchase.item_id}`}>
          <img src={`${baseurl}user${purchase.seller.id}item${purchase.item_id}`} style={{width: "100%"}}/>
        </NavLink>
      </p>
      <p className="purchase-details">
        <p>{displayRating()}</p>
        {purchase.description ? (<p className="review-description">{purchase.description}</p>) : null}
        <p>Purchased From: <NavLink to={`/user/${purchase.seller.id}`}>@{purchase.seller.username}</NavLink> {setPurchasedTime(purchase.purchase_date)}</p>
        {cancel ?
          <button className="small red button" onClick={() => selectPurchase(null)}>Cancel</button>
          : <button className="small green button" onClick={() => selectPurchase(purchase)}>{purchase.review ? "Edit this review" : "Add a Review"}</button>}
      </p>
    </div>
  )
}

export default purchaseCard
