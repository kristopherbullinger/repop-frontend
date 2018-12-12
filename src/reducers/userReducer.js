let initialState = {
  currentUser: {},
  selectedUser: {},
  jwt: ""
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {...state, currentUser: action.payload.user, jwt: action.payload.jwt}
    case SET_SELECTED_USER:
      return {...state, selectedUser: action.payload}
      case LOGOUT:
        return {...state, currentUser: {}}
    default:
     return state
  }
}


const SET_CURRENT_USER = "SET_CURRENT_USER"
const SET_SELECTED_USER = "SET_SELECTED_USER"
const LOGOUT = "LOGOUT"

export default userReducer
