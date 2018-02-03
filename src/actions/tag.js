import axios from 'axios'
import {
  TAG_GET_ALL,
  API_BASE,
  TAG_GET,
  PENDING_TAGS
} from '../helpers/consts';

export function getAllTags() {
  return async function(dispatch) {
    dispatch({
      type: PENDING_TAGS
    })

    let tags = await axios.get(`${API_BASE}/tags`)

    setTimeout(() => {
      dispatch({
        type: TAG_GET_ALL,
        payload: tags.data.data
      })
    }, 500)
  }
}

export function getTag(name) {
  return async function(dispatch) {
    let tag = await axios.get(`${API_BASE}/tag/${name}`)

    return dispatch({ 
      type: TAG_GET,
      payload: tag.data.data
    })
  }
}