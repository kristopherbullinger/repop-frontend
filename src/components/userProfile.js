import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import userimg from '../images/user.jpg'
import { API_URL } from '../APIEndpoint.js'
import ItemCardContainer from './itemCardContainer.js'
import NewItemForm from './newItemForm.js'



class UserProfile extends Component {

  state = {
    self: this.props.match.params.user_id == this.props.currentUser.id,
    user: {},
    items: [],
    newItem: false
  }

  componentDidMount() {
      fetch(`${API_URL}/users/${this.props.match.params.user_id}`)
      .then(res => res.json())
      .then(res => this.setState({user: res.selectedUser, items: res.items}, () => console.log(this.state.items[0])))
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
        fetch(`${API_URL}/users/${this.props.match.params.user_id}`)
        .then(res => res.json())
        .then(user => {
          this.setState({user: user.selectedUser, self: user.selectedUser.id == this.props.currentUser.id})})
    }
  }

  toggleFollow = () => {
    fetch(`${API_URL}/relationships/toggle`, {
      method: "POST",
      headers: {"Content-Type": "application/json", "Authorization": `Bearer ${this.props.jwt}`},
      body: JSON.stringify({id: this.state.user.id})
    })
    .then(res => 1)
    .then(res => {
      this.props.toggleFollow(this.state.user.id)
    })
  }

  toggleNewItem = () => this.setState({newItem: !this.state.newItem})

  isFollowing = () => this.props.currentUser.following.find(f => f.id == this.state.user.id) ? <p onClick={this.toggleFollow}>Following</p> : <p onClick={this.toggleFollow}>Follow</p>

  render() {
    return (
      <>
        <img src={userimg} alt="profile"/>
        <p>@{this.state.user.username}</p>
        {this.state.self ? <p onClick={this.toggleNewItem}>{ this.state.newItem ? "Close Form" : "List a new item"}</p> : null}
        {this.state.newItem ? <NewItemForm addNewItem={this.addNewItem}/> : null}
        {this.props.currentUser.id && !this.state.self ? this.isFollowing() : null}
        {this.state.items[0] ? <ItemCardContainer items={this.state.items}/>: null}
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
    toggleFollow: id => dispatch({type: "TOGGLE_FOLLOW", payload: id})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)
