import axios from 'axios'
import {
  GET_USER_INFO,
  API_BASE,
  GET_PROFILE,
  CONFIG
} from '../helpers/consts'

export function getUserInfo(id) {
  return async function(dispatch) {
    let user = await axios.get(`${API_BASE}/user/${id}`, CONFIG)

    console.log(user)
    if (user.status === 200) {
      if (user.data.user.accessLevel > 0) {
        document.cookie = 'al=' + user.data.user.accessLevel
      }

      setTimeout(() => {
        dispatch({
          type: GET_USER_INFO,
          payload: user.data.user
        })
      }, 500)
    }
  }
}

export function getProfile(name) {
  return async function(dispatch) {
    let profile = await axios.get(`${API_BASE}/profile/${name}`)

    setTimeout(() => {
      dispatch({
        type: GET_PROFILE,
        payload: profile.data.profile
      })
    }, 500);
  }
}