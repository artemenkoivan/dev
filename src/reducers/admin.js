import { Map } from 'immutable'
import {
  GET_ALL_USERS,
  PENDING_USERS,
  PENDING,
  EDIT_USER,
  TAG_CREATE,
  GET_EDIT_USER
} from '../helpers/consts'

const initialState = new Map({
  users: [],
  user: {},
  pendingUsers: false,
  pending: false,
  successfully: false
})

function adminReducer(state = initialState, action) {
  switch (action.type) {
    case PENDING_USERS:
      return state.set('pendingUsers', true)
    case PENDING:
      return state.set('pending', true)
    case GET_EDIT_USER:
      return state.set('user', action.payload).set('pending', false)
    case EDIT_USER:
      return state.set('successfully', true)
    case TAG_CREATE:
      return state.set('successfully', true)
    case GET_ALL_USERS:
      return state.set('users', action.payload).set('pendingUsers', false)
    default:
      return state
  }
}

export default adminReducer
