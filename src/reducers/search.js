import { SEARCH } from '../helpers/consts'
import { Map } from 'immutable'

const initialState = new Map({
  results: []
})

function searchReducer(state = initialState, action) {
  
  if (action.type === SEARCH) {
    return state.set('results', action.payload)
  } else {
    return state
  }
}

export default searchReducer