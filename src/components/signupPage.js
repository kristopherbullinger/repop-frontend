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
    let s = this.state
    debugger
    if (!this.state.image) {return window.alert("Show the world your beautiful face! (Please add an image)")}
    let { username, password, password_confirmation, location, email } = this.state
    fetch(`${API_URL}/users`,{
      method: "POST",
      headers: {"Content-Type": 'application/json'},
      body: JSON.stringify({user: {username, password, password_confirmation, location, email}})
    })
    .then(r => {
      debugger
      if (r.status === 200) {return r.json()}
      else {r.errors.forEach(m => window.alert(m))}
    })
    .then(resp => {
      let jwt = resp.jwt
      let user = resp.user
      let action = {type: "SET_CURRENT_USER", payload: {user, jwt}}

      //host image
      let uploadurl = "https://api.cloudinary.com/v1_1/repop/image/upload"
      let uploadpreset = "oyejxmyi"
      let formdata = new FormData()
      formdata.append('file', this.state.image)
      formdata.append("upload_preset", uploadpreset)
      formdata.append("public_id", `user${user.id}`)
      let xhr = new XMLHttpRequest()
      xhr.open("POST", uploadurl, true)
      xhr.send(formdata)
      window.alert("Sending to the cloud....")

      //if error uploading, cancel user creation and inform user. if successful, create session
      xhr.onload = () => {
        if (xhr.status === 200) {
          window.alert("All good")
          this.props.logIn(action)
          this.setState({redirect: true})
        } else {
          window.alert("there was some kind of error. try again")
          fetch(`${API_URL}/users`, {
            method: "DELETE",
            headers: {"Content-type": "application/json", "Authorization": `Bearer ${this.props.jwt}`},
            body: JSON.stringify({id: user.id})
          })
        }
      }
    })
  }

  onImageDrop = (files) => {
    let file = files[0]
    let fr = new FileReader()
    let newItemFile = document.querySelector("#new-item-file")
    let preview = document.querySelector("#new-item")
    fr.addEventListener("load", () => preview.src = fr.result)
    fr.readAsDataURL(file)
    this.setState({image: file})
  }

  onFileChange = (e) => this.onImageDrop(e.target.files)


  render() {
    const { redirect } = this.state
    return (redirect ? <Redirect to="/"/> : <div id="login">
            <img id="new-item" style={{width:'350px', height:'350px', display: this.state.image ? 'block' : 'none'}} src="" alt="newitemupload"/>
            {!this.state.image ? <Dropzone multiple={false} accept="image/*" onDrop={this.onImageDrop} >
            {({getRootProps, getInputProps, isDragActive}) => <div className="dropzone" {...getRootProps()} >Add an Image (Click here or drop one off)<input {...getInputProps()} id="new-item-file" onChange={this.onFileChange}/></div>}
            </Dropzone> : null }
            <form id="signup" className="login-signin" method="post" onSubmit={this.handleSubmit}>
                <label>Username</label>
                <input type="text" name="username" value={this.state.username} onChange={this.handleChange}/><br/>
                <label>Email</label>
                <input type="text" name="email" value={this.state.email} onChange={this.handleChange}/><br/>
                <label>Location</label>
                <input type="text" name="location" value={this.state.location} onChange={this.handleChange}/><br/>
                <label>Password</label>
                <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/><br/>
                <label>Password Confirmation</label>
                <input type="password" name="password_confirmation" value={this.state.password_confirmation} onChange={this.handleChange}/><br/>
              <input type="submit" className="button small green" name="submit" value="Sign Up"/>
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
