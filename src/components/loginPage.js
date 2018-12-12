import React, { Component } from 'react'
import { connect } from 'react-redux'
import { API_URL } from '../APIEndpoint.js'
import { withRouter } from 'react-router-dom'

class LoginForm extends Component {
  state = {
    username: "",
    password: ""
  }

  handleChange = event => this.setState({[event.target.name]: event.target.value})

  handleSubmit = event => {
    event.preventDefault()
    fetch(`${API_URL}/login`,{
      method: "POST",
      headers: {"Content-Type": 'application/json'},
      body: JSON.stringify({user: {...this.state}})
    })
    .then(r => r.json())
    .then(resp => {
      if (resp.jwt) {
        let jwt = resp.jwt
        let user = resp.user
        let action = {type: "SET_CURRENT_USER", payload: {
          user, jwt
        }}
        this.props.login(action)
      } else {
        resp.errors.forEach(m => window.alert(m))
      }
    })
  }

  render() {
    return (
      <div id="login">
        <form id="signin" action="index.html" method="post" onSubmit={this.handleSubmit}>
          <label>Username</label>
          <input type="text" name="username" value={this.state.username} onChange={this.handleChange}/>
          <label>Password</label>
          <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
          <input type="submit" name="submit" value="Sign In"/>
        </form>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logIn: action => dispatch(action)
  }
}

export default withRouter(connect(null, mapDispatchToProps)(LoginForm))
