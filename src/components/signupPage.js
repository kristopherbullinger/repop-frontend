import React, { Component } from 'react'
import { connect } from 'react-redux'
import { API_URL } from '../APIEndpoint.js'
import { withRouter, Redirect, NavLink } from 'react-router-dom'
import Dropzone from 'react-dropzone'

class SignupForm extends Component {
  state = {
    username: "",
    password: "",
    password_confirmation: "",
    location: "",
    email: "",
    redirect: false,
    image: ""
  }

  handleChange = event => this.setState({[event.target.name]: event.target.value})

  handleSubmit = event => {
    event.preventDefault()
    if (!this.state.image) {return window.alert("Show the world your beautiful face! (Please add an image)")}
    let { username, password, password_confirmation, location, email } = this.state
    fetch(`${API_URL}/users`,{
      method: "POST",
      headers: {"Content-Type": 'application/json'},
      body: JSON.stringify({user: {username, password, password_confirmation, location, email}})
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
            <img id="new-item" style={{width:'350px', height:'350px', display: this.state.image ? 'block' : 'none'}} src="" alt="newitemupload"/>
            {!this.state.image ? <Dropzone multiple={false} accept="image/*" onDrop={this.onImageDrop} >
            {({getRootProps, getInputProps, isDragActive}) => <div className="dropzone" {...getRootProps()} >Add an Image (Click here or drop one off)<input {...getInputProps()} id="new-item-file" onChange={this.onFileChange}/></div>}
            </Dropzone> : null }
            <form id="signup" className="login-signin" method="post" onSubmit={this.handleSubmit}>
                <label for="username" >Username</label>
                <input type="text" name="username" value={this.state.username} onChange={this.handleChange}/><br/>
                <label for="email" >Email</label>
                <input type="text" name="email" value={this.state.email} onChange={this.handleChange}/><br/>
                <label for="location" >Location</label>
                <input type="text" name="location" value={this.state.location} onChange={this.handleChange}/><br/>
                <label for="password">Password</label>
                <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/><br/>
                <label for="password_confirmation">Password Confirmation</label>
                <input type="password" name="password_confirmation" value={this.state.password_confirmation} onChange={this.handleChange}/><br/>
              <input type="submit" className="button" name="submit" value="Sign Up"/>
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
