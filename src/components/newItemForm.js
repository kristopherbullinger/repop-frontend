import React, { Component, Fragment } from 'react'
import { API_URL } from '../APIEndpoint.js'
import { connect } from 'react-redux'
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

  handleFileChange = event => {
    this.setState({image: event.target.files[0]})
  }

  handleSubmit = (event) => {
    event.preventDefault()
    if (this.state.image === "") {return window.alert("You must include an image!")}

    let { description, size, price, brand } = this.state
    fetch(`${API_URL}/items`, {
      method: "POST",
      headers: {"Content-type": "application/json", "Authorization": `Bearer ${this.props.jwt}`},
      body: JSON.stringify({"item": {description, size, price, brand}})
    })
    .then(res => {
      if (res.status === 200) {return res.json()}
      else {res.errors.forEach(error => window.alert(error))}})
    .then(response => {
      let { item } = response
      let uploadurl = "https://api.cloudinary.com/v1_1/repop/image/upload"
      let uploadpreset = "oyejxmyi"
      let formdata = new FormData()
      formdata.append('file', this.state.image)
      formdata.append("upload_preset", uploadpreset)
      formdata.append("public_id", `user${this.props.currentUser.id}item${item.id}`)
      let xhr = new XMLHttpRequest()
      xhr.open("POST", uploadurl, true)
      xhr.send(formdata)
    })
  }

  onImageDrop = () => {
    console.log("dropped")
  }

  onFileChange = (e) => {
    this.setState({image: e.target.files[0]})
    console.log(e.target.files[0])
  }

  render () {
    return (<>
      <form onSubmit={this.handleSubmit}>
        <Dropzone multiple={false} accept="image/*" onDrop={this.onImageDrop}>
        {({getRootProps, getInputProps, isDragActive}) => <div className="dropzone" {...getRootProps()}>Upload an image for your new item<input {...getInputProps()} onChange={this.onFileChange}/></div>}
        </Dropzone>
        <label>Description</label>
        <input name="description" type="text" value={this.state.description} onChange={this.handleChange}/> <br/>
        <label>Price</label>
        <input name="price" type="number" value={this.state.price} onChange={this.handleChange}/><br/>
        <label>Size</label>
        <input name="size" type="text" value={this.state.size} onChange={this.handleChange}/><br/>
        <label>Brand</label>
        <input name="brand" type="text" value={this.state.brand} onChange={this.handleChange}/><br/>
        <input type="submit" value="Post Item"/>
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

const mapDispatchToProps = state => {
  return {
    dummyKey: () => "dummyValue"
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewItemForm)
