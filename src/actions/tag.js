import axios from 'axios'
import {
  TAG_GET_ALL,
  API_BASE,
  TAG_GET,
  PENDING_TAGS,
  CONFIG
} from '../helpers/consts'
import latestAction from '../helpers/latestAction'

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

export function editTag(data) {
  return async function(dispatch) {
    const fileConfig = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': false,
        tagId: data._id
      }
    }

    let tag = await axios.put(
      `${API_BASE}/admin/tag/edit/${data._id}`,
      data,
      CONFIG
    )

    if (tag.data.status === 200) {
      alert('Тег изменен')
      window.location.href = `/admin/tag/edit/${tag.data.data}`
      latestAction('Изменен тег', tag.data.data)
    }

    if (data.cover !== null) {
      let tagCover = await axios.post(
        `${API_BASE}/admin/tag/edit-cover`,
        data.cover,
        fileConfig
      )

      getTag(tag.data.data)
    }
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
