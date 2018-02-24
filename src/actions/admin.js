import axios from 'axios'
import {
  GET_ALL_USERS,
  TAG_CREATE,
  PENDING_USERS,
  GET_EDIT_USER,
  PENDING,
  EDIT_USER,
  API_BASE,
  CONFIG
} from '../helpers/consts'

CONFIG.headers.userId = localStorage.getItem('_id')

export function getAllUsers() {
  return async function(dispatch) {
    dispatch({
      type: PENDING_USERS
    })

    let users = await axios.get(`${API_BASE}/admin/users`, CONFIG)

    setTimeout(() => {
      dispatch({
        type: GET_ALL_USERS,
        payload: users.data.data
      })
    }, 1000)
  }
}

export function getUser(name) {
  return async function(dispatch) {
    dispatch({ type: PENDING })

    let user = await axios.get(`${API_BASE}/admin/user/${name}`, CONFIG)

    dispatch({
      type: GET_EDIT_USER,
      payload: user.data.user
    })
  }
}

export function createTag(data) {
  return async function(dispatch) {
    const fileConfig = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': false,
        userId: localStorage.getItem('_id')
      }
    }

    await axios.post(
      `${API_BASE}/admin/tag?description=${data.description}&title=${
        data.title
      }`,
      data.cover,
      fileConfig
    )

    dispatch({
      type: TAG_CREATE
    })
  }
}

export function editUser(form) {
  return async function(dispatch) {
    let response = await axios.post(`${API_BASE}/admin/user/edit`, form, CONFIG)

    if (response.status === 200) {
      dispatch({ type: EDIT_USER })
    }
  }
}
