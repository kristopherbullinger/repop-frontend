import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'


const FollowCard = (props) => {
  const { user, toggleFollow } = props
  return (
    <div className="follow-card">
      <div>@{user.username}</div>
        {user.id !== props.currentUser.id ?
          <button className="small green button" onClick={() => toggleFollow(user.id)}>{props.currentUser.following.find(f => f.id == user.id) ? "Unfollow" : "Follow"}</button>
          : <button className="small green button">Unfollow @{props.selectedUser.username}</button>}
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
