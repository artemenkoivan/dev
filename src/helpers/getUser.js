import store from '../store'
import * as actions from '../actions/user'

function getUser() {
  const id = localStorage.getItem('_id')

  if (localStorage.getItem('access_token')) {
    store.dispatch(actions.getUserInfo(id))
  }
}

export default getUser