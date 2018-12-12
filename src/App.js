import React, { Component, Fragment } from 'react';
import './App.css';
import Header from './components/header'
import Login from './components/loginPage'
import { Switch, Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import MainContent from './components/mainContent'
import { API_URL } from './APIEndpoint.js'
import selectedItemDisplay from './components/selectedItemDisplay'

class App extends Component {

  componentDidMount() {
    fetch(`${API_URL}/items`)
    .then(res => res.json())
    .then(items => {
      this.props.setHotItems(items.items)
    })
  }

  render() {
    return (
      <>
       <Header/>
       <Switch>
         <Route exact path="/login" component={Login}/>
         <Route exact path="/" component={MainContent}/>
         <Route exact path="/user/:user_id/item/:item_id" component={selectedItemDisplay}/>
       </Switch>
     </>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setHotItems: items => dispatch({type: "GET_HOT_ITEMS", payload: items})
  }
}

export default withRouter(connect(null, mapDispatchToProps)(App));
