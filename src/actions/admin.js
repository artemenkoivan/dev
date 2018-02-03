import axios from 'axios'
import {
  GET_ALL_USERS,
  TAG_CREATE,
  PENDING_USERS,
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

export function createTag(data) {
  return async function(dispatch) {
    const fileConfig = {
      'headers': {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': false,
        'userId': localStorage.getItem('_id')
      }
    }

    await axios.post(`${API_BASE}/admin/tag?description=${data.description}&title=${data.title}`, data.cover, fileConfig)

    dispatch({
      type: TAG_CREATE
    })
  }
}