import axios from 'axios'
import { CONFIG, API_BASE } from '../helpers/consts'

export function remove(userId) {
  return async function(dispatch) {
    let response = await axios.delete(
      `${API_BASE}/notification/${userId}`,
      CONFIG
    )

    console.log(response)
  }
}
