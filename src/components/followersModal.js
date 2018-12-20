import React, { Component, Fragment } from 'react'
import FollowCard from './followCard.js'
import { connect } from 'react-redux'


class FollowersModal extends Component {

  state = {
    switch: this.props.default
  }
  componentDidMount() {
    console.log("mounting modal")
  }

  renderFollowCards = users => users[0] ? users.map(user => <FollowCard user={user} toggleFollow={this.props.toggleFollow} key={user.id} followers={this.state.switch}/>) : <p>No users here yet...</p>

  handleClick = bool => this.setState({switch: bool})

  //userList={this.state.switch ? this.props.currentUser.followers : this.props.currentUser.following}

  render() {
    return (
    <div className="modalContainer" onClick={() => this.props.toggle(true)}>
      <div className="modalContent" onClick={e => e.stopPropagation()}>
        <p onClick={() => this.handleClick(true)} className={"hoverLinkStyle" + (this.state.switch ? " selected" : "")}>Followers</p>
        <p onClick={() => this.handleClick(false)} className={"hoverLinkStyle" + (!this.state.switch ? " selected" : "")}>Following</p>
        <div className="userslist">
          {this.state.switch ?
            this.renderFollowCards(this.props.followers)
            : this.renderFollowCards(this.props.following)}
        </div>
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
