import React, { Component } from 'react'
import { connect } from 'react-redux'



class UserProfile extends Component {

  state = {
    self: this.props.match.params.user_id == this.props.currentUser.id
  }

  render() {
    return(<p>This is my profile: {this.state.self.toString()}</p>)
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.users.currentUser
  }
}

export default connect(mapStateToProps)(UserProfile)
