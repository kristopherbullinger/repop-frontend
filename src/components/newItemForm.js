import React, { Component, Fragment } from 'react'
import { API_URL } from '../APIEndpoint.js'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Dropzone from 'react-dropzone'


class NewItemForm extends Component {
  state = {
    description: "",
    price: "",
    size: "",
    brand: "",
    image: ""
  }

  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  }

  handleSubmit = (event) => {
    event.preventDefault()
    if (this.state.image === "") {return window.alert("You must include an image!")}
    if (this.state.price < 0) {return window.alert("Price cannot be negative")}
    let price = parseFloat(this.state.price).toFixed(2)
    if (parseFloat(price.split(".")[0]) == parseFloat(price)) price = price.split(".")[0]
    let { description, size, brand } = this.state
    // attempt to connect to DB to post new item info
    fetch(`${API_URL}/items`, {
      method: "POST",
      headers: {"Content-type": "application/json", "Authorization": `Bearer ${this.props.jwt}`},
      body: JSON.stringify({"item": {description, size, price, brand}})
    })
    .then(res => {
      if (res.status === 200) {return res.json()}
      else {res.errors.forEach(error => window.alert(error))}})
    .then(response => {
      //if successful, attempt to post image to backend
      let { item, user } = response
      let uploadurl = "https://api.cloudinary.com/v1_1/repop/image/upload"
      let uploadpreset = "oyejxmyi"
      let formdata = new FormData()
      formdata.append('file', this.state.image)
      formdata.append("upload_preset", uploadpreset)
      formdata.append("public_id", `user${this.props.currentUser.id}item${item.id}`)
      let xhr = new XMLHttpRequest()
      xhr.open("POST", uploadurl, true)
      xhr.send(formdata)
      window.alert("Sending to the cloud....")
      xhr.onload = () => {
        if (xhr.status === 200) {
          window.alert("All good")
          // this.props.addNewItem(item)
          // this.props.setSelectedUser(user)
          this.props.updateCurrentUser(user)
          this.props.history.push(`/user/${this.props.currentUser.id}/item/${item.id}`)
        } else {
          //if error posting image, delete item in backend
          window.alert("there was some kind of error. try again")
          fetch(`${API_URL}/items`, {
            method: "DELETE",
            headers: {"Content-type": "application/json", "Authorization": `Bearer ${this.props.jwt}`},
            body: JSON.stringify({id: item.id})
          })
        }
      }
    })
  }

  onImageDrop = (files) => {
    let file = files[0]
    let fr = new FileReader()
    // let newItemFile = document.querySelector("#new-item-file")
    let preview = document.querySelector("#new-item")
    fr.addEventListener("load", () => preview.src = fr.result)
    fr.readAsDataURL(file)
    this.setState({image: file})
  }

  onFileChange = (e) => this.onImageDrop(e.target.files)

  render () {
    return (<>
      <form onSubmit={this.handleSubmit} className="newItemForm">
        <ul>
          <li>
            <img id="new-item" style={{width:'350px', height:'350px', display: this.state.image ? 'inline-block' : 'none'}} src="" alt="newitemupload"/>
            {!this.state.image ? <Dropzone multiple={false} accept="image/*" onDrop={this.onImageDrop} >
            {({getRootProps, getInputProps, isDragActive}) => <div className="dropzone" {...getRootProps()} >Add an Image (Click here or drop one off)<input {...getInputProps()} id="new-item-file" onChange={this.onFileChange}/></div>}
            </Dropzone> : null }
          </li>
          <li>
            <label>Description</label><br/>
            <textarea name="description" rows="5" columns="666" type="text" value={this.state.description} onChange={this.handleChange}/> <br/>
            <label>Price</label>
            <input name="price" type="number" value={this.state.price} onChange={this.handleChange}/><br/>
            <label>Size</label>
            <input name="size" type="text" value={this.state.size} onChange={this.handleChange}/><br/>
            <label>Brand</label>
            <input name="brand" type="text" value={this.state.brand} onChange={this.handleChange}/><br/>
            <input type="submit" value="Post Item" className="small green button"/>
          </li>
        </ul>
      </form>
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.users.currentUser,
    jwt: state.users.jwt
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateCurrentUser: user => dispatch({type: "UPDATE_CURRENT_USER", payload: user}),
    setSelectedUser: user => dispatch({type: "SET_SELECTED_USER", payload: user})
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewItemForm))
