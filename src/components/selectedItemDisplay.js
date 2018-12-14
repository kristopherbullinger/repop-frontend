import React, { Component, Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { API_URL } from '../APIEndpoint.js'

class selectedItemDisplay extends Component {

  componentDidMount() {
    debugger
    fetch(`${API_URL}/items/${this.props.match.params.item_id}`)
    .then(res => res.json())
    .then(item => {
      debugger
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
    debugger
    fetch(`${API_URL}/likes/toggle`, {
        method: "POST",
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${this.props.jwt}`},
        body: JSON.stringify({id: this.props.selectedItem.id})})
    .then(res => 1)
    .then(like => {
      debugger
      this.props.toggleLike(this.props.currentUser.id)
    })
  }

  render() {
    return (
      <>
        <div className="displayItem">
          <p>SelectedItem</p>
          <img src={this.props.selectedItem} alt="selected item image"/>
          {this.props.selectedItem.user ? <NavLink to={`/user/${this.props.selectedItem.user.id}`}><p>@{this.props.selectedItem.user.username}</p></NavLink> : null}
          <p>Description: {this.props.selectedItem.description}</p>
          <p>Size: {this.props.selectedItem.size}</p>
          <p>Brand: {this.props.selectedItem.brand}</p>
          <p>Likes: {this.props.selectedItem.likes ? this.props.selectedItem.likes.length : null}</p>
          {this.props.selectedItem.likes && this.props.currentUser.id && this.props.selectedItem.likes.find(l => l.user_id == this.props.currentUser.id) ? <p onClick={this.toggleLike}>You like this item</p> : <p onClick={this.toggleLike}>Click to like this</p>}
          <p>Posted {this.setPostedTime(this.props.selectedItem.created_at)}</p>
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
