import React, { Component, Fragment } from 'react'



class reviewForm extends Component {

  state = {
    rating: this.props.rating || 5,
    description: this.props.description || ""
  }

  handleSubmit = e => {
    e.preventDefault()
    console.log("get to it!!!")
    //fetch "POST", if successful update current user.
  }

  handleChange = e => this.setState({[e.target.name]: e.target.value})

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>Rating</label>
        <input type="number" name="rating" min="1" max="5" onChange={this.handleChange} value={this.state.rating}/>
        <label>Add a Message</label>
        <button type="submit">Submit</button>
        <textarea name="description" onChange={this.handleChange} value={this.state.description}/>
      </form>
    )
  }
}

export default reviewForm
