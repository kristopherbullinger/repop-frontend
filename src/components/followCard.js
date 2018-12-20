import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'


const FollowCard = (props) => {
  const { user, toggleFollow, followers } = props

  const renderButton = () => {
    //if the selected user is me OR the user on the card is not me, then toggleFollow will act on the user on the card
    if (props.currentUser.id === props.selectedUser.id || user.id !== props.currentUser.id) return (<button className="small green button" onClick={() => toggleFollow(user.id)}>{props.currentUser.following.find(f => f.id == user.id) ? "Unfollow" : "Follow"}</button>)
    //if the user on the card is me, toggleFollow will act on selectedUser in the followers list, and will be null on the following list
    if (followers) {
      return (<button className="small green button" onClick={() => toggleFollow(props.selectedUser.id)}>Unfollow @{props.selectedUser.username}</button>)
    } else {
      return (<button className="small green button">Following You</button>)
    }
  }

  return (
    <div className="follow-card">
      <div><NavLink to={`/user/${user.id}`}>@{user.username}</NavLink></div>
        {renderButton()}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    currentUser: state.users.currentUser,
    selectedUser: state.users.selectedUser
  }
}

export default connect(mapStateToProps)(FollowCard)
