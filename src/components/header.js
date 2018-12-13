import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { LOGOUT } from '../actions/userActions'


const Header = (props) => {
  return (
    <nav>
      <NavLink to="/">repop </NavLink>
      <NavLink to="/">Search </NavLink>
      {props.user.username ? <><NavLink to={`/user/${props.user.id}`}>Profile </NavLink> <NavLink to="/" onClick={() => props.logout()}>Logout  </NavLink></> : <NavLink to="/login">Log In </NavLink>}
    </nav>
  )
}

const mapStateToProps = state => {
  return {user: state.users.currentUser}
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(LOGOUT)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
