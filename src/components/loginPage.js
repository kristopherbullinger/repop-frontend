import React, { Component } from 'react'
import { connect } from 'react-redux'
import { API_URL } from '../APIEndpoint.js'
import { withRouter, Redirect, NavLink } from 'react-router-dom'

class LoginForm extends Component {
  state = {
    username: "",
    password: "",
    redirect: false
  }

  handleChange = event => this.setState({[event.target.name]: event.target.value})

  handleSubmit = event => {
    event.preventDefault()
    fetch(`${API_URL}/login`,{
      method: "POST",
      headers: {"Content-Type": 'application/json'},
      body: JSON.stringify({user: {username: this.state.username, password: this.state.password }})
    })
    .then(r => r.json())
    .then(resp => {
      if (resp.jwt) {
        let jwt = resp.jwt
        let user = resp.user
        console.log("Found user ", user.username)
        let action = {type: "SET_CURRENT_USER", payload: {
          user, jwt
        }}
        this.props.logIn(action)
        this.setState({redirect: true})
      } else {
        resp.errors.forEach(m => window.alert(m))
      }
    })
  }

  render() {
    const { redirect } = this.state
    return (redirect ? <Redirect to="/"/> : <div id="login">
            <form id="signin" className="login-signin" action="index.html" method="post" onSubmit={this.handleSubmit}>
              <label>Username</label>
              <input type="text" name="username" value={this.state.username} onChange={this.handleChange}/><br/>
              <label>Password</label>
              <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/><br/>
              <input type="submit" className="small green button" name="submit" value="Sign In"/><br/><br/>
              <NavLink to="/signup">Are you new here?</NavLink>
            </form>
          </div>)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logIn: action => dispatch(action)
  }
}

export default withRouter(connect(null, mapDispatchToProps)(LoginForm))
