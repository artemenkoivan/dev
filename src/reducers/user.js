import { Map } from 'immutable'
import { GET_USER_INFO, GET_PROFILE } from '../helpers/consts'

const al = document.cookie.split(' ')
const access = al.includes('al=1')

const initialState = new Map({
  userName: '',
  email: '',
  avatar: '',
  createdAt: '',
  noAvatar: 'https://forum.mikrotik.com/styles/canvas/theme/images/no_avatar.jpg',
  accessLevel: access ? 1 : 0,
  profile: {}
})

function userReducer(state = initialState, action) {
  switch(action.type) {
    case GET_USER_INFO:
      return state
          .set('userName', action.payload.userName)
          .set('email', action.payload.email)
          .set('accessLevel', action.payload.accessLevel)
          .set('avatar', action.payload.avatar)
          .set('createdAt', action.payload.createdAt)
    case GET_PROFILE: 
      return state
          .set('profile', action.payload)
    default:
      return state
  }
}

export default userReducer