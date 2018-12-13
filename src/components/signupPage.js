import React, { Component } from 'react'
import { connect } from 'react-redux'
import { API_URL } from '../APIEndpoint.js'
import { withRouter, Redirect, NavLink } from 'react-router-dom'

class SignupForm extends Component {
  state = {
    username: "",
    password: "",
    password_confirmation: "",
    location: "",
    email: "",
    redirect: false
  }

  handleChange = event => this.setState({[event.target.name]: event.target.value})

  handleSubmit = event => {
    event.preventDefault()
    fetch(`${API_URL}/users`,{
      method: "POST",
      headers: {"Content-Type": 'application/json'},
      body: JSON.stringify({user: {username: this.state.username, password: this.state.password, password_confirmation: this.state.password_confirmation, location: this.state.location, email: this.state.email}})
    })
    .then(r => r.json())
    .then(resp => {
      if (resp.jwt) {
        let jwt = resp.jwt
        let user = resp.user
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
            <form id="signup" method="post" onSubmit={this.handleSubmit}>
                <label for="username" >Username</label>
                <input type="text" name="username" value={this.state.username} onChange={this.handleChange}/>
                <label for="email" >Email</label>
                <input type="text" name="email" value={this.state.email} onChange={this.handleChange}/>
                <label for="location" >Location</label>
                <input type="text" name="location" value={this.state.location} onChange={this.handleChange}/>
                <label for="password">Password</label>
                <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
                <label for="password_confirmation">Password Confirmation</label>
                <input type="password" name="password_confirmation" value={this.state.password_confirmation} onChange={this.handleChange}/>
              <input type="submit" name="submit" value="Sign Up"/>
            </form>
          </div>)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logIn: action => dispatch(action)
  }
}

export default withRouter(connect(null, mapDispatchToProps)(SignupForm))
