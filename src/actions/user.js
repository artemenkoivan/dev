import axios from 'axios'
import {
  GET_USER_INFO,
  API_BASE,
  GET_PROFILE,
  CONFIG,
  EDIT_PROFILE,
  EDIT_PROFILE_ERROR,
  EDIT_PROFILE_SUCCESS
} from '../helpers/consts'
import { getCookie } from '../helpers/cookies'

export function getUserInfo(id) {
  return async function(dispatch) {
    let user = await axios.get(`${API_BASE}/user/${id}`, CONFIG)

    if (user.status === 200) {
      if (user.data.user.accessLevel > 0) {
        if (!!getCookie('al') === false) {
          document.cookie = 'al=' + parseInt(user.data.user.accessLevel)
        }
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

    if (profile.data.status === 404) {
      // TODO handle 404
      // window.location.href = '/'
    } else {
      setTimeout(() => {
        dispatch({
          type: GET_PROFILE,
          payload: profile.data.profile
        })
      }, 500)
    }
  }
}

export function editProfile(data) {
  return async function(dispatch) {
    const fileConfig = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': false,
        userId: localStorage.getItem('_id')
      }
    }

    let response = await axios.post(`${API_BASE}/profile/edit`, data, CONFIG)

    if (data.formAvatar) {
      let avatar = await axios.post(
        `${API_BASE}/profile/edit-avatar`,
        data.formAvatar,
        fileConfig
      )

      if (avatar.status === 200) {
        dispatch({ type: EDIT_PROFILE_SUCCESS })
      }
    }

    if (response.status === 200) {
      dispatch({ type: EDIT_PROFILE_SUCCESS })
    }
  }
}
