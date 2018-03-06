import axios from 'axios'
import {
  TAG_GET_ALL,
  API_BASE,
  TAG_GET,
  PENDING_TAGS,
  CONFIG
} from '../helpers/consts'

export function getAllTags() {
  return async function(dispatch) {
    dispatch({
      type: PENDING_TAGS
    })

    let tags = await axios.get(`${API_BASE}/tags`)

    dispatch({
      type: TAG_GET_ALL,
      payload: tags.data.data
    })
  }
}

export function getTag(name) {
  return async function(dispatch) {
    let tag = await axios.get(`${API_BASE}/tag/${name}`)

    dispatch({
      type: TAG_GET,
      payload: tag.data.data
    })
  }
}

export function follow(id) {
  return async function(dispatch) {
    let data = {
      tagId: id,
      userId: localStorage.getItem('_id')
    }
    let followTag = await axios.post(`${API_BASE}/tag/follow`, data, CONFIG)

    dispatch(getTag(followTag.data.title))
  }
}
