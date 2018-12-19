import React, { Component, Fragment } from 'react'
import FollowCard from './followCard.js'
import { connect } from 'react-redux'




class FollowersModal extends Component {

  state = {
    switch: false
  }

  renderFollowCards = users => users.map(user => <FollowCard user={user}/>)

  render() {
    return (
    <div className="modalContainer">
      <div className="modalContent">
        <p onClick={() => this.setState({switch: false})}>Followers</p><p onClick={() => this.setState({switch: true})}>Following</p>
        {this.state.switch ? renderFollowCards(followers) : renderFollowCards(following)}
      </div>
    </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser
  }
}

export default connect(mapStateToProps)(FollowersModal)
