let initialState = {
  hotItems: [],
  similarItems: [],
  selectedItem: {}
}


const itemReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_HOT_ITEMS:
      return {...state, hotItems: [...state.hotItems, ...action.payload]}
    case GET_SIMILAR_ITEMS:
      return {...state, similarItems: {...action.payload}}
    case SELECT_ITEM:
      return  {...state, selectedItem: action.payload}
    case TOGGLE_LIKE:
      let newlikes = state.selectedItem.likes.find(l => l.user_id == action.payload) ? state.selectedItem.likes.filter(l => l.user_id != action.payload) : [...state.selectedItem.likes, {user_id: action.payload}]
      let updatedSelectedItem = {...state.selectedItem, likes: newlikes}
      return {...state, selectedItem: updatedSelectedItem}
    default:
      return state
  }
}

const TOGGLE_LIKE = "TOGGLE_LIKE"
const SET_HOT_ITEMS = "SET_HOT_ITEMS"
const GET_SIMILAR_ITEMS = "GET_SIMILAR_ITEMS"
const SELECT_ITEM = "SELECT_ITEM"

export default itemReducer
