import { Map } from 'immutable'
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  REGISTER,
  REGISTER_SUCCESS,
  LOGOUT,
  REGISTER_ERROR,
  CLEAR_AUTH_ERRORS
} from '../helpers/consts'

const initialState = new Map({
  authenticated: !!localStorage.getItem('access_token'),
  pending: false,
  serverError: ''
})

function authReducer(state = initialState, action) {
  switch(action.type) {
    case CLEAR_AUTH_ERRORS:
      return state.set('serverError', '')
    case LOGIN:
      return state
          .set('pending', true)
          .set('serverError', '')
    case LOGIN_SUCCESS:
      return state
          .set('pending', false)
          .set('authenticated', true)
    case LOGIN_ERROR:
      return state
          .set('serverError', action.payload)
          .set('authenticated', false)
          .set('pending', false)
    case REGISTER:
      return state
          .set('pending', true)
    case REGISTER_SUCCESS:
      return state
          .set('pending', false)
          .set('authenticated', true)
    case REGISTER_ERROR:
      return state
          .set('pending', false)
          .set('authenticated', false)
          .set('serverError', action.payload)
    case LOGOUT:
      return state
          .set('pending', false)
          .set('authenticated', false)
          .set('serverError', '')
    default:
      return state
  }
}

export default authReducer