import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { API_URL } from '../APIEndpoint.js'
import ItemCardContainer from './itemCardContainer.js'
import NewItemForm from './newItemForm.js'
import defaultUserImg from '../images/defaultUser.png'



class UserProfile extends Component {

  state = {
    self: this.props.match.params.user_id == this.props.currentUser.id,
    user: {},
    items: [],
    likedItems: [],
    newItem: false,
    edit: false,
    showSelling: true
  }

  componentDidMount() {
      fetch(`${API_URL}/users/${this.props.match.params.user_id}`)
      .then(res => res.json())
      .then(res => {
        let { user, items, likedItems } = res
        this.setState({user, items, likedItems})
      })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
        fetch(`${API_URL}/users/${this.props.match.params.user_id}`)
        .then(res => res.json())
        .then(res => {
          let { user, items, likedItems } = res
          let self = user.id == this.props.match.params.user_id
          this.setState({user, items, likedItems, self})
        })
    }
  }

  toggleFollow = () => {
    fetch(`${API_URL}/relationships/toggle`, {
      method: "POST",
      headers: {"Content-Type": "application/json", "Authorization": `Bearer ${this.props.jwt}`},
      body: JSON.stringify({id: this.state.user.id})
    })
    .then(res => {
      if (res.ok) return res.json()
      else return window.alert("There was some kind of error. Please try again.")
    })
    .then(res => {
      let { user } = res
      this.setState({user})
      this.props.toggleFollow(this.state.user.id)
    })
  }

  toggleNewItem = () => this.setState({newItem: !this.state.newItem})

  toggleEdit = () => this.setState({edit: !this.state.edit})

  publishEdit = () => {
    let newbio = document.querySelector("#update-bio").value
    debugger
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
      this.props.updateUser(user)
      this.setState({edit: false, user: user})
    })
  }

  showSelling = () => this.setState({showSelling: true})

  showLikedItems = () => this.setState({showSelling: false})

  isFollowing = () => this.props.currentUser.following.find(f => f.id == this.state.user.id) ? <button className="button small green" onClick={this.toggleFollow}>Following</button> : <button className="button small green" onClick={this.toggleFollow}>Follow</button>

  render() {
    const baseurl = "https://res.cloudinary.com/repop/image/upload/v1545005116/"
    return (
      <>
      <div className="userInfoContainer clearfix">
        <span className="userDetails">
          <img className="userProfilePhoto" src={this.state.user.id ? `${baseurl}user${this.state.user.id}` : defaultUserImg} alt="profile" onError={(e)=>{e.target.onerror = null; e.target.src=defaultUserImg}}/>
        </span>
        <span className="username">@{this.state.user.username}{this.state.self ? <p id="editSwitch" onClick={this.toggleEdit}>{this.state.edit ? "Cancel Edit" : "Edit Profile"}</p> : null}
        {this.state.user.followers ? <div className="clearfix"><span className="followers">{this.state.user.followers.length} Followers</span><span className="followers">{this.state.user.following.length} Following</span></div> : null}
        {this.props.currentUser.id && !this.state.self ? this.isFollowing() : null}
            {this.state.edit ? <div><textarea rows="6" columns="500" defaultValue={this.state.user.bio} id="update-bio"/><button onClick={this.publishEdit}>Publish</button></div> : <p>{this.state.user.bio}</p>}
        </span>
      </div>

      {this.state.newItem ? <NewItemForm addNewItem={this.addNewItem}/> : null}

      <div className="clearfix itemContainerHeader"><span className="showItemToggle hoverLinkStyle" onClick={this.showSelling}>Selling</span><span className="showItemToggle  hoverLinkStyle" onClick={this.showLikedItems}>Likes</span>{this.state.self ? <span onClick={this.toggleNewItem} className="newItemToggle showItemToggle  hoverLinkStyle">{ this.state.newItem ? "Close Form" : "List Something New"}</span> : null}</div>
      {<ItemCardContainer items={this.state.showSelling ? this.state.items : this.state.likedItems}/>}

      </>)
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.users.currentUser,
    jwt: state.users.jwt
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleFollow: id => dispatch({type: "TOGGLE_FOLLOW", payload: id}),
    updateUser: user => dispatch({type: "UPDATE_CURRENT_USER", payload: {user}}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)
