import React, { Component, Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { API_URL } from '../APIEndpoint.js'
import defaultItem from '../images/defaultItem.jpg'

class selectedItemDisplay extends Component {

  state = {
    modal: false
  }

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
      this.props.toggleLike(this.props.currentUser.id)
    })
  }

  deleteItem = () => {
    return null
    //send delete request to item endpoint
    //delete image from cloudinary
  }

  purchaseItem = () => {
    if (!!this.props.selectedItem.purchase) {
      fetch(`${API_URL}/purchases`, {
        method: "POST",
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${this.props.jwt}`},
        body: JSON.stringify({seller_id: this.props.selectedItem.user.id, item_id: this.props.selectedItem.id})})
      .then(res => res.json())
      .then(res => {
        if (res.errors) return res.errors.forEach(err => window.alert(err))
        this.props.selectItem(res.item)
      })
    } else return null
  }

  toggleModal = () => this.setState({modal: !this.state.modal})

  renderButton = () => {
    if (this.props.currentUser.id && this.props.selectedItem.id) {
      if (!!this.props.selectedItem.purchase) {
        return (<button className="large green button not-allowed">Sold</button>)
      } else if (this.props.selectedItem.user.id == this.props.currentUser.id) {
        return (<button className="button large green" onClick={this.deleteItem}>Remove Listing</button>)
      } else return (<button className="button large green" onClick={this.purchaseItem}>Purchase Item</button>)
    } else return null
  }

  renderLikes = () => {
    if (this.props.selectedItem.id) {
      if (this.props.currentUser.id) {
        let liked = !!this.props.selectedItem.likes.find(l => l.user_id == this.props.currentUser.id)
        return (<p onClick={this.toggleLike} id="likes" className="hoverLinkStyle">{liked ? "♥️" : "🖤" } {this.props.selectedItem.likes.length} Likes</p>)
      } else {
        return (<p id="likes">♥️ {this.props.selectedItem.likes.length} Likes</p>)
      }
    } else return null
  }

  render() {
    const baseurl = "https://res.cloudinary.com/repop/image/upload/v1545005116/"
    return (
      <>
        <div className="displayItem">
          <span style={{float: 'left'}}>
            {this.props.selectedItem.user ?
              <img id="selected-item"
                src={`${baseurl}/user${this.props.selectedItem.user.id}item${this.props.selectedItem.id}.jpg`}
                alt="selected item image"/>
                : <img src={defaultItem}
                className="blurry"
                id="selected-item"/>}
          </span>
          <span className="itemDetails" >
          {this.props.selectedItem.user ?
            <NavLink  to={`/user/${this.props.selectedItem.user.id}`}>
            <h2 className="hoverLinkStyle">@{this.props.selectedItem.user.username}</h2>
            </NavLink>
            : null}
          <span>Description: {this.props.selectedItem.description}</span><br/>
          <span>Price: ${this.props.selectedItem.price}</span><br/>
          <span>Size: {this.props.selectedItem.size}</span>
          <span>Brand: {this.props.selectedItem.brand}</span>
          <div>
            <span>
              {this.renderLikes()}
            </span>
          </div>
          {this.renderButton()}
          <div>
          <p>Posted {this.setPostedTime(this.props.selectedItem.created_at)}</p>
          <p>{this.props.selectedItem.user ? this.props.selectedItem.user.location : null}</p>
          </div>
          </span>
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
