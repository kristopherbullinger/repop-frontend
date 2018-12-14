let initialState = {
  hotItems: [],
  similarItems: [],
  selectedItem: {}
}


const itemReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_HOT_ITEMS:
      return {...state, hotItems: [...state.hotItems, ...action.payload]}
    case GET_SIMILAR_ITEMS:
      return {...state, similarItems: {...action.payload}}
    case SELECT_ITEM:
      return  {...state, selectedItem: action.payload}
    case TOGGLE_LIKE:
      let newlikes = state.selectedItem.likes.find(l => l.user_id == action.payload) ? state.selectedItem.likes.filter(l => l.user_id != action.payload) : [...state.selectedItem.likes, {id: action.payload}]
      let updatedSelectedItem = {...state.selectedItem, likes: newlikes}
      debugger
      return {...state, selectedItem: updatedSelectedItem}
    default:
      return state
  }
}

const TOGGLE_LIKE = "TOGGLE_LIKE"
const GET_HOT_ITEMS = "GET_HOT_ITEMS"
const GET_SIMILAR_ITEMS = "GET_SIMILAR_ITEMS"
const SELECT_ITEM = "SELECT_ITEM"

export default itemReducer
