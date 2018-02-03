import { Map } from 'immutable'
import {
  GET_ALL_USERS,
  PENDING_USERS,
  TAG_CREATE
} from '../helpers/consts'

const initialState = new Map({
  users: [],
  pendingUsers: false,
  successfully: false
})

function adminReducer(state = initialState, action) {

  switch(action.type) {
    case PENDING_USERS:
      return state.set('pendingUsers', true)
    case TAG_CREATE:
      return state.set('successfully', true)
    case GET_ALL_USERS:
      return state
          .set('users', action.payload)
          .set('pendingUsers', false)
    default:
      return state
  }
}

export default adminReducer
