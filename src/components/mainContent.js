import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import ItemCardContainer from './itemCardContainer'
import { withRouter } from 'react-router-dom'
import loading from '../images/loading.gif'


class MainPage extends Component {
  render () {
    return(
      <div>
      <h2 className="logo">repop</h2>
      {this.props.items[0] ? <ItemCardContainer items={this.props.items}/> : <div id="loading"><img src={loading}/></div>}
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
