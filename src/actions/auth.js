import axios from 'axios'
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  REGISTER,
  REGISTER_SUCCESS,
  REGISTER_ERROR,
  LOGOUT,
  CLEAR_AUTH_ERRORS,
  API_BASE
} from '../helpers/consts'
import { removeCookies } from '../helpers/cookies'

const ACTION_DELAY = 1500

export function login(data) {
  return async function(dispatch) {
    dispatch({
      type: LOGIN
    })

    try {
      let loginResponse = await axios.post(`${API_BASE}/login`, data)

      setTimeout(() => {
        if (
          loginResponse.data.status > 200 &&
          loginResponse.data.status < 500
        ) {
          return dispatch({
            type: LOGIN_ERROR,
            payload: loginResponse.data.message
          })
        }

        if (loginResponse.data.access_token) {
          localStorage.setItem('access_token', loginResponse.data.access_token)
          localStorage.setItem('userName', loginResponse.data.user.userName)
          localStorage.setItem('_id', loginResponse.data.user.id)

          dispatch({
            type: LOGIN_SUCCESS
          })

          window.location.reload()
        }
      }, ACTION_DELAY)
    } catch ({ message }) {
      dispatch({
        type: LOGIN_ERROR,
        payload: message
      })
    }
  }
}

export function register(data) {
  return async function(dispatch) {
    dispatch({
      type: REGISTER
    })

    try {
      let registerResponse = await axios.post(`${API_BASE}/register`, data)

      setTimeout(() => {
        if (
          registerResponse.data.status > 200 &&
          registerResponse.data.status < 500
        ) {
          return dispatch({
            type: REGISTER_ERROR,
            payload: registerResponse.data.message
          })
        }

        if (registerResponse.data.access_token) {
          localStorage.setItem(
            'access_token',
            registerResponse.data.access_token
          )
          localStorage.setItem('_id', registerResponse.data.user.id)
          localStorage.setItem('userName', registerResponse.data.user.userName)

          dispatch({
            type: REGISTER_SUCCESS
          })

          window.location.reload()
        }
      }, ACTION_DELAY)
    } catch ({ message }) {
      dispatch({
        type: REGISTER_ERROR,
        payload: message
      })
    }
  }
}

export function logout() {
  return function(dispatch) {
    localStorage.removeItem('_id')
    localStorage.removeItem('access_token')
    localStorage.removeItem('userName')
    removeCookies()

    dispatch({
      type: LOGOUT
    })

    window.location.reload()
  }
}

export function clearAuthErrors() {
  return function(dispatch) {
    dispatch({
      type: CLEAR_AUTH_ERRORS
    })
  }
}
