import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import ItemCardContainer from './itemCardContainer'
import { withRouter } from 'react-router-dom'


class MainPage extends Component {
  render () {
    return(
      <div>
      <h2 className="logo">repop</h2>
      <ItemCardContainer items={this.props.items}/>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    items: state.items.hotItems
  }
}

export default withRouter(connect(mapStateToProps)(MainPage))
