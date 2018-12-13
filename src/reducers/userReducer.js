let initialState = {
  currentUser: JSON.parse(localStorage.getItem('currentUser')) || {},
  selectedUser: {},
  jwt: localStorage.getItem('jwt') || ""
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      localStorage.setItem('currentUser', JSON.stringify(action.payload.user))
      localStorage.setItem('jwt', action.payload.jwt)
      return {...state, currentUser: action.payload.user, jwt: action.payload.jwt}
    case SET_SELECTED_USER:
      return {...state, selectedUser: action.payload}
      case LOGOUT:
        delete localStorage.currentUser
        delete localStorage.jwt
        return {...state, currentUser: {}}
    default:
     return state
  }
}


const SET_CURRENT_USER = "SET_CURRENT_USER"
const SET_SELECTED_USER = "SET_SELECTED_USER"
const LOGOUT = "LOGOUT"

export default userReducer
