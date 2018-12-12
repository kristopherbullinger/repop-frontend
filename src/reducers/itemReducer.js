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
    default:
      return state
  }
}
const GET_HOT_ITEMS = "GET_HOT_ITEMS"
const GET_SIMILAR_ITEMS = "GET_SIMILAR_ITEMS"
const SELECT_ITEM = "SELECT_ITEM"

export default itemReducer
