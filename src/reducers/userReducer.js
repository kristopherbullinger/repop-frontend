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
    case UPDATE_CURRENT_USER:
      return {...state, currentUser: action.payload}
    case TOGGLE_FOLLOW:
      let newfollowers = state.currentUser.following.find(f => f.id == action.payload) ? state.currentUser.following.filter(f => f.id != action.payload) : [...state.currentUser.following, {id: action.payload}]
      let updatedUser = {...state.currentUser, following: newfollowers}
      return {...state, currentUser: updatedUser}
    case LOGOUT:
      delete localStorage.currentUser
      delete localStorage.jwt
      return {...state, currentUser: {}, jwt: ""}
    default:
     return state
  }
}


const SET_CURRENT_USER = "SET_CURRENT_USER"
const UPDATE_CURRENT_USER = "UPDATE_CURRENT_USER"
const SET_SELECTED_USER = "SET_SELECTED_USER"
const LOGOUT = "LOGOUT"
const TOGGLE_FOLLOW = "TOGGLE_FOLLOW"

export default userReducer
