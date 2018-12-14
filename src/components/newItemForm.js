import React, { Component, Fragment } from 'react'
import { API_URL } from '../APIEndpoint.js'
import { connect } from 'react-redux'



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
    debugger
    this.setState({image: event.target.files[0]})
  }

  handleSubmit = (event) => {
    event.preventDefault()
    let s = this.state
    let formdata = new FormData(e.target)
    // formdata.append('image', this.state.image, "photo.jpg")
    // formdata.append('description', this.state.description)
    // formdata.append('price', this.state.price)
    // formdata.append('size', this.state.size)
    // formdata.append('brand', this.state.brand)
    // debugger
    fetch(`${API_URL}/items`, {
      method: "POST",
      headers: {"Authorization": `Bearer ${this.props.jwt}`},
      body: formdata
    })
  }

  render () {
    return (<>
      <form onSubmit={this.handleSubmit}>
        <label>Description</label>
        <input name="description" type="text" value={this.state.description} onChange={this.handleChange}/> <br/>
        <label>Price</label>
        <input name="price" type="number" value={this.state.price} onChange={this.handleChange}/><br/>
        <label>Size</label>
        <input name="size" type="text" value={this.state.size} onChange={this.handleChange}/><br/>
        <label>Brand</label>
        <input name="brand" type="text" value={this.state.brand} onChange={this.handleChange}/><br/>
        <input id="images" name="image" type="file" onChange={this.handleFileChange}/><br/>
        <input type="submit" value="Post Item"/>
      </form>
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    jwt: state.users.jwt
  }
}

const mapDispatchToProps = state => {
  return {
    dummyKey: () => "dummyValue"
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewItemForm)
