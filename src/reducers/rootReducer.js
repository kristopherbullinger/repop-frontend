import itemReducer from './itemReducer'
import userReducer from './userReducer'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({items: itemReducer, users: userReducer})

export default rootReducer
