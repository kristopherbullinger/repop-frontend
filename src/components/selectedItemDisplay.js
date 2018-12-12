import React, { Component } from 'react'
import { connect } from 'react-redux'
import { API_URL } from '../APIEndpoint.js'

class selectedItemDisplay extends Component {
  componentDidMount() {
    debugger
    fetch(`${API_URL}/items/${this.props.match.params.item_id}`)
    .then(res => res.json())
    .then(item => {
      let selectedItem = item.item
    })
  }

  render() {
    return (
      <p>you selected an item!</p>
    )
  }
}

const mapStateToProps = state => {
  return {
    selectedItem: state.items.selectedItem
  }
}

export default connect(mapStateToProps)(selectedItemDisplay)
