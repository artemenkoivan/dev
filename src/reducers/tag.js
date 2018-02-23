import { Map } from 'immutable'
import { PENDING_TAGS, TAG_GET_ALL, TAG_GET } from '../helpers/consts'

const initialState = new Map({
  tags: [],
  searchTag: [],
  pendingTags: false
})

function tagReducer(state = initialState, action) {
  switch (action.type) {
    case PENDING_TAGS:
      return state.set('pendingTags', true)
    case TAG_GET_ALL:
      return state.set('tags', action.payload).set('pendingTags', false)
    case TAG_GET:
      return state.set('searchTag', action.payload).set('pending', false)
    default:
      return state
  }
}

export default tagReducer
