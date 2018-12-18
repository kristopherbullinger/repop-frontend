import React, { Component, Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { API_URL } from '../APIEndpoint.js'
import defaultItem from '../images/defaultItem.jpg'

class selectedItemDisplay extends Component {

  componentDidMount() {
    this.props.selectItem({})
    fetch(`${API_URL}/items/${this.props.match.params.item_id}`)
    .then(res => res.json())
    .then(item => {
      this.props.selectItem(item.item)
    })
  }

  setPostedTime = date => {
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

  toggleLike = () => {
    fetch(`${API_URL}/likes/toggle`, {
        method: "POST",
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${this.props.jwt}`},
        body: JSON.stringify({id: this.props.selectedItem.id})})
    .then(res => {
      if (res.ok) return null
      else return window.alert("There was some type of problem. Try again.")
    })
    .then(like => {
      let id = this.props.currentUser.id
      this.props.toggleLike(this.props.currentUser.id)
    })
  }

  deleteItem = () => {
    return null
    //send delete request to item endpoint
    //delete image from cloudinary
  }

  purchaseItem = () => {
    fetch(`${API_URL}/purchases`, {
      method: "POST",
      headers: {"Content-Type": "application/json", "Authorization": `Bearer ${this.props.jwt}`},
      body: JSON.stringify({seller_id: this.props.selectedItem.user.id, item_id: this.props.selectedItem.id})})
    .then(res => {
      if (res.ok) return res.json()
      else return window.alert("There was some kind of error. Please try again in a bit.")})
    .then(response => {
      debugger
    })

  }

  render() {
    const baseurl = "https://res.cloudinary.com/repop/image/upload/v1545005116/"
    return (
      <>
        <div className="displayItem">
          <span style={{float: 'left'}}>
          {this.props.selectedItem.user ? <img id="selected-item" src={`${baseurl}/user${this.props.selectedItem.user.id}item${this.props.selectedItem.id}.jpg`} alt="selected item image"/> : <img src={defaultItem} className="blurry" id="selected-item"/>} </span>
          <span className="itemDetails" >
          {this.props.selectedItem.user ? <NavLink to={`/user/${this.props.selectedItem.user.id}`}><h2>@{this.props.selectedItem.user.username}</h2></NavLink> : null}
          <span>Description: {this.props.selectedItem.description}</span><br/>
          <span>Size: {this.props.selectedItem.size}</span>
          <span>Brand: {this.props.selectedItem.brand}</span>
          <div>
          <span>{this.props.currentUser.id && this.props.selectedItem.id ? (this.props.selectedItem.likes.find(l => l.user_id == this.props.currentUser.id) ? <span onClick={this.toggleLike} className="hoverLinkStyle">♥️ {this.props.selectedItem.likes.length} Likes</span> : <span onClick={this.toggleLike} className="hoverLinkStyle">🖤 {this.props.selectedItem.likes.length} Likes</span>) : null}</span>
          </div>

          <div>
          <p>Posted {this.setPostedTime(this.props.selectedItem.created_at)}</p>
          <p>{this.props.selectedItem.user ? this.props.selectedItem.user.location : null}</p>
          </div>
          </span>

          <div>{this.props.selectedItem.user && this.props.selectedItem.user.id == this.props.currentUser.id ? <button className="button large green" onClick={this.deleteItem}>Remove Listing</button> : <button className="button large green" onClick={this.purchaseItem}>Purchase Item</button>}</div>
        </div>
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    selectedItem: state.items.selectedItem,
    currentUser: state.users.currentUser,
    jwt: state.users.jwt
  }
}

const mapDispatchToProps = dispatch => {
  return {
    selectItem: item => dispatch({type: "SELECT_ITEM", payload: item}),
    toggleLike: id => dispatch({type: "TOGGLE_LIKE", payload: id})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(selectedItemDisplay)
