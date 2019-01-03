import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import PurchaseCard from './purchaseCard.js'
import ReviewCard from './reviewCard.js'
import ReviewForm from './reviewForm.js'

const baseurl = "https://res.cloudinary.com/repop/image/upload/v1545005116/"


class ReviewsModal extends Component {

  state = {
    //switch true: show reviews of items the user has sold. switch false: show purchases the user has made. (only if user is self)
    "switch": true,
    selectedPurchase: null
  }

  renderReviews = () => {
    //"purchased" means the user is the seller
    //"purchases" means the user is the buyer
    return (this.props.selectedUser.purchased && this.props.selectedUser.purchased.find(p => p.review) ?
      this.props.selectedUser.purchased.filter(p => p.review).map(rev => <ReviewCard key={rev.id} review={rev}/>)
      : <p>{this.props.selectedUser.id === this.props.currentUser.id ? "You have" : "This user has"} no reviews yet!</p>
    )
  }

  selectPurchase = purchase => this.setState({selectedPurchase: purchase}, () => console.log(this.state.selectedPurchase))

  renderPurchases = () => {
    return (this.props.selectedUser.purchases ?
      this.props.selectedUser.purchases.map(p => <PurchaseCard key={p.id} purchase={p} selectPurchase={this.selectPurchase}/>)
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

  renderContent = () => {
    if (this.state.selectedPurchase) {
      return (
        <>
          <PurchaseCard purchase={this.state.selectedPurchase} selectPurchase={this.selectPurchase} cancel={true}/>
          <ReviewForm purchase={this.state.selectedPurchase} exit={() => this.selectPurchase(null)}/>
        </>
      )
    } else {
      return this.state.switch ? this.renderReviews() : this.renderPurchases()
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
            : <p style={{marginLeft: "25%"}} className="selected">Reviews</p>}
          {this.renderContent()}
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
