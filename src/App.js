import React, { Component, Fragment } from 'react';
import './App.css';
import Header from './components/header'
import Login from './components/loginPage'
import Signup from './components/signupPage'
import UserProfile from './components/userProfile.js'
import { Switch, Route, withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import MainContent from './components/mainContent'
import { API_URL } from './APIEndpoint.js'
import selectedItemDisplay from './components/selectedItemDisplay'

class App extends Component {

  componentDidMount() {
    let t = setTimeout(() => window.alert("there seems to be an issue connecting to the server. try refreshing the page.") ,5000)
    fetch(`${API_URL}/items`)
    .then(res => res.json())
    .then(res => {
      clearTimeout(t)
      this.props.setHotItems(res.items)
    })
  }

  render() {
    return (
      <>
       <Header/>
       <Switch>
         <Route exact path="/login" component={Login}/>
         <Route exact path="/signup" component={Signup}/>
         <Route exact path="/" component={MainContent}/>
         <Route exact path="/user/:user_id" component={UserProfile}/>
         <Route exact path="/user/:user_id/item/:item_id" component={selectedItemDisplay}/>
         <Redirect to="/"/>
       </Switch>
     </>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setHotItems: items => dispatch({type: "SET_HOT_ITEMS", payload: items})
  }
}

export default withRouter(connect(null, mapDispatchToProps)(App));
