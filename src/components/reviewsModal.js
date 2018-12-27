import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

const baseurl = "https://res.cloudinary.com/repop/image/upload/v1545005116/"


class ReviewsModal extends Component {

  state = {
    //switch true: show reviews of items the user has sold. switch false: show purchases the user has made. (only if user is self)
    "switch": true
  }

  renderReviews = () => {
    //"purchased" means the user is the seller
    //"purchases" means the user is the buyer
    return (this.props.selectedUser.purchased && this.props.selectedUser.purchased.find(p => p.review) ?
      this.props.selectedUser.purchased.filter(p => p.review).map(rev => {
        return (<div key={rev.item_id} className="purchaseCard">
          <p>
            <NavLink to={`/user/${this.props.selectedUser.id}/item/${rev.item_id}`}>
              <img src={`${baseurl}user${this.props.selectedUser.id}item${rev.item_id}`} style={{width: 50}}/>
            </NavLink>
          </p>
          <p>{rev.rating}/5</p>
          <p>{rev.description}</p>
          <p>Purchased By: <NavLink to={`/user/${rev.purchaser.id}`}>@{rev.purchaser.username}</NavLink></p>
        </div>)
      })
      : <p>This user has no reviews yet!</p>
    )
  }

  renderPurchases = () => {
    console.log(this.props.selectedUser)
    //"purchased" means the user is the seller
    //"purchases" means the user is the buyer
    //<NavLink to={`/user/${item.user.id}/item/${item.id}`}>
    return (this.props.selectedUser.purchases ?
      this.props.selectedUser.purchases.map(p => {
        return (<div key={p.item_id} className="purchaseCard">
          <p>
            <NavLink to={`/user/${p.seller.id}/item/${p.item_id}`}>
              <img src={`${baseurl}user${p.seller.id}item${p.item_id}`} style={{width: 50}}/>
            </NavLink>
          </p>
          <p>Purchased From: <NavLink to={`/user/${p.seller.id}`}>@{p.seller.username}</NavLink></p>
          <p>Purchased {this.setPurchasedTime(p.purchase_date)}</p>
        </div>)
      })
      : <p>You haven't purchased anything yet</p>)
  }

  setPurchasedTime = date => {
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

  render () {
    return (
      <div className="modalContainer" onClick={this.props.toggleModal}>
        <div className="modalContent" onClick={e => e.stopPropagation()}>
          {this.props.selectedUser.id == this.props.currentUser.id ?
            <>
              <p onClick={() => this.setState({"switch": true})} className={"hoverLinkStyle" + (this.state.switch ? " selected" : "")}>Reviews</p>
              <p onClick={() => this.setState({"switch": false})} className={"hoverLinkStyle" + (!this.state.switch ? " selected" : "")}>Purchases</p>
            </>
            : <div>Reviews</div>}
          {this.state.switch ? this.renderReviews() : this.renderPurchases()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.users.currentUser,
    selectedUser: state.users.selectedUser
  }
}

export default connect(mapStateToProps)(ReviewsModal)
