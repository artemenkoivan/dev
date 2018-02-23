import axios from 'axios'
import { SEARCH, API_BASE } from '../helpers/consts'

export function searchQuery(queryString) {
  return async function(dispatch) {
    let searchResults = await axios.get(`${API_BASE}/search/${queryString}`)

    dispatch({
      type: SEARCH,
      payload: searchResults.data.searchResults
    })
  }
}
