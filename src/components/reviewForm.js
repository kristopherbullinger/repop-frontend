import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { API_URL } from '../APIEndpoint.js'



class reviewForm extends Component {

  state = {
    rating: this.props.purchase.rating || 5,
    description: this.props.purchase.description || ""
  }

  handleSubmit = e => {
    e.preventDefault()
    let review = {review: {purchase_id: this.props.purchase.id, rating: this.state.rating, description: this.state.description}}
    fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: {"Content-Type": "application/json", "Authorization": `Bearer ${this.props.jwt}`},
      body: JSON.stringify(review)})
    .then(res => res.json())
    .then(res => {
      if (res.errors) return res.errors.forEach(err => window.alert(err))
      this.props.updateCurrentUser(res.currentUser)
      this.props.setSelectedUser(res.currentUser)
      this.props.exit()
    })
  }

  handleChange = e => this.setState({[e.target.name]: e.target.value})

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>Rating</label>
        <input type="number" name="rating" min="1" max="5" onChange={this.handleChange} value={this.state.rating}/>
        <br/>
        <label>Add a Message</label>
        <br/>
        <textarea name="description" onChange={this.handleChange} value={this.state.description}/>
        <br/>
        <button type="submit">Submit</button>
      </form>
    )
  }
}

const mapStateToProps = state => {
  return {
    jwt: state.users.jwt
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateCurrentUser: user => dispatch({type: "UPDATE_CURRENT_USER", payload: user}),
    setSelectedUser: user => dispatch({type: "SET_SELECTED_USER", payload: user})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(reviewForm)
