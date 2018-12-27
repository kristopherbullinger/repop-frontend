import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { API_URL } from '../APIEndpoint.js'
import ItemCardContainer from './itemCardContainer.js'
import NewItemForm from './newItemForm.js'
import defaultUserImg from '../images/defaultUser.png'
import FollowersModal from './followersModal.js'
import ReviewsModal from './reviewsModal.js'



class UserProfile extends Component {

  state = {
    self: this.props.match.params.user_id == this.props.currentUser.id,
    items: [],
    likedItems: [],
    newItem: false,
    edit: false,
    showSelling: true,
    showReviews: false,
    //contains a switch for showing followersModal or not(switch), and a switch to determine whether followers or following appear first(default)
    showFollows: {switch: false, default: true}
  }

  componentDidMount() {
      fetch(`${API_URL}/users/${this.props.match.params.user_id}`)
      .then(res => res.json())
      .then(res => {
        let { user, items, likedItems } = res
        this.props.setSelectedUser(user)
        this.setState({items, likedItems})
      })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
        this.props.setSelectedUser({}) // prevent old user info from rendering upon navigating to different user page
        let self = this.props.currentUser.id == this.props.match.params.user_id
        this.setState({self, newItem: false, edit: false, showSelling: true, showReviews: false, showFollows: {switch: false, default: true}})
        fetch(`${API_URL}/users/${this.props.match.params.user_id}`)
        .then(res => res.json())
        .then(res => {
          let { user, items, likedItems } = res
          this.props.setSelectedUser(user)
          this.setState({items, likedItems})
        })
    }
  }

  toggleFollow = (id) => {
    console.log(this.props.currentUser)
    fetch(`${API_URL}/relationships/toggle`, {
      method: "POST",
      headers: {"Content-Type": "application/json", "Authorization": `Bearer ${this.props.jwt}`},
      body: JSON.stringify({id: id})
    })
    .then(res => {
      if (res.ok) return res.json()
      else return window.alert("There was some kind of error. Please try again.")
    })
    .then(res => {
      let { currentUser, followedUser } = res

       // always update current user to reflect new relationship
      this.props.updateCurrentUser(currentUser)

      //if i am the selected user, update the selected user with the current user to reflect the changes in both places.
      if (this.props.currentUser.id === this.props.selectedUser.id) this.props.setSelectedUser(currentUser)

      //if i have liked the selected user, update the selected user
      if (followedUser.id === this.props.selectedUser.id) this.props.setSelectedUser(followedUser)
    })
  }

  toggleNewItem = () => this.setState({newItem: !this.state.newItem})

  toggleEdit = () => this.setState({edit: !this.state.edit})

  toggleShowFollows = (bool) => this.setState({showFollows: {switch: !this.state.showFollows.switch, default: bool}}, () => console.log(this.state.showFollows))

  toggleReviews = () => this.setState({showReviews: !this.state.showReviews})

  publishEdit = () => {
    let newbio = document.querySelector("#update-bio").value
    fetch(`${API_URL}/users/${this.props.currentUser.id}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json", "Authorization": `Bearer ${this.props.jwt}`},
      body: JSON.stringify({user: {bio: newbio}})
    })
    .then(res => {
      if (res.ok) return res.json()
      else window.alert("Something went wrong. Try again.")
    })
    .then(resp => {
      let {user} = resp
      this.props.setSelectedUser(user)
      this.setState({edit: false})
    })
  }

  showSelling = () => this.setState({showSelling: true})

  sellerRating = () => {
    let ratings = this.props.selectedUser.purchased.map(p => p.rating).filter(Boolean)
    let ratingsCount = this.props.selectedUser.purchased.map(p => p.rating).filter(Boolean).length
    return ratings.reduce( (acc, val) => acc + val) / ratingsCount
  }

  showLikedItems = () => this.setState({showSelling: false})

  renderFollowButton = () => this.props.currentUser.following.find(f => f.id == this.props.selectedUser.id) ? <button className="button small green" onClick={() => this.toggleFollow(this.props.selectedUser.id)}>Following</button> : <button className="button small green" onClick={() => this.toggleFollow(this.props.selectedUser.id)}>Follow</button>

  render() {
    const baseurl = "https://res.cloudinary.com/repop/image/upload/v1545005116/"
    return (
      <>
        <div className="userInfoContainer clearfix">
          <span className="userDetails">
            <img className={"userProfilePhoto" + (!this.props.selectedUser.id ? " blurry" : "")}
                src={this.props.selectedUser.id ? `${baseurl}user${this.props.selectedUser.id}` : defaultUserImg}
                alt="profile"
                onError={(e)=>{e.target.onerror = null; e.target.src=defaultUserImg}}/>
          </span>
          <span className="username">@{this.props.selectedUser.username}
            {this.props.selectedUser.purchased && this.props.selectedUser.purchased.find(p => p.review) ?
              <p onClick={this.toggleReviews} className="hoverLinkStyle">Seller Rating: {this.sellerRating()}/5</p>
              : <p>No Reviews Yet</p>
            }
            {this.state.self ?
              <div>
                <p id="editSwitch" onClick={this.toggleEdit}>{this.state.edit ? "Cancel Edit" : "Edit Profile"}</p>
              </div>
              : null}
            {this.props.selectedUser.followers ?
              <div className="clearfix">
                <span className="followers hoverLinkStyle"
                      onClick={() => this.toggleShowFollows(true)}>{this.props.selectedUser.followers.length} Followers
                </span>
                <span className="followers hoverLinkStyle"
                      onClick={() => this.toggleShowFollows(false)}>{this.props.selectedUser.following.length} Following
                </span>
              </div>
              : null}
            {this.props.currentUser.id && !this.state.self ? this.renderFollowButton() : null}
            {this.state.edit ?
              <div><textarea rows="6" columns="500" defaultValue={this.props.selectedUser.bio} id="update-bio"/><button onClick={this.publishEdit}>Publish</button></div>
              : <p>{this.props.selectedUser.bio}</p>}
          </span>
        </div>

        {this.state.newItem ?
          <NewItemForm addNewItem={this.addNewItem}/>
          : null}

        <div className="clearfix itemContainerHeader">
          <span className={"showItemToggle hoverLinkStyle" + (this.state.showSelling ? " selected": "")} onClick={this.showSelling}>Selling</span>
          <span className={"showItemToggle hoverLinkStyle" + (!this.state.showSelling ? " selected": "")} onClick={this.showLikedItems}>Likes</span>
          {this.state.self ?
            <span onClick={this.toggleNewItem} className={"newItemToggle showItemToggle  hoverLinkStyle" + (this.state.newItem ? " selected": "")}>{ this.state.newItem ? "Close Form" : "List Something New"}</span>
            : null}
        </div>

        {this.state.showFollows.switch ?
          <FollowersModal followers={this.props.selectedUser.followers}
                          following={this.props.selectedUser.following}
                          toggle={this.toggleShowFollows}
                          toggleFollow={this.toggleFollow}
                          default={this.state.showFollows.default}/>
          : null}

        {this.state.showReviews ?
          <ReviewsModal toggleModal={this.toggleReviews}/>
        : null}

        {<ItemCardContainer items={this.state.showSelling ? this.state.items : this.state.likedItems}/>}
      </>)
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.users.currentUser,
    selectedUser: state.users.selectedUser,
    jwt: state.users.jwt
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleFollow: (id, username) => dispatch({type: "TOGGLE_FOLLOW", payload: id}),
    updateCurrentUser: user => dispatch({type: "UPDATE_CURRENT_USER", payload: user}),
    setSelectedUser: user => dispatch({type: "SET_SELECTED_USER", payload: user})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)
