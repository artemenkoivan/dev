export const LOGIN = 'LOGIN'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_ERROR = 'LOGIN_ERROR'
export const REGISTER = 'REGISTER'
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS'
export const REGISTER_ERROR = 'REGISTER_ERROR'
export const LOGOUT = 'LOGOUT'
export const GET_USER_INFO = 'GET_USER_INFO'
export const CLEAR_AUTH_ERRORS = 'CLEAR_AUTH_ERRORS'
export const TAG_GET_ALL = 'TAG_GET_ALL'
export const TAG_GET = 'TAG_GET'
export const TAG_CREATE = 'TAG_CREATE'
export const TAG_REMOVE = 'TAG_REMOVE'
export const SEARCH = 'SEARCH'
export const QUESTION_GET = 'QUESTION_GET'
export const QUESTION_GET_SUCCESS = 'QUESTION_GET_SUCCESS'
export const QUESTION_GET_FAILURE = 'QUESTION_GET_FAILURE'
export const QUESTION_NEW = 'QUESTION_NEW'
export const QUESTION_NEW_SUCCESS = 'QUESTION_NEW_SUCCESS'
export const QUESTION_NEW_FAILURE = 'QUESTION_NEW_FAILURE'
export const SINGLE_QUESTION_GET = 'SINGLE_QUESTION_GET'
export const ANSWER_ADD = 'ANSWER_ADD'
export const ANSWER_LIKE = 'ANSWER_LIKE'
export const GET_PROFILE = 'GET_PROFILE'

export const API_BASE = 'http://localhost:5000/api'

let token = localStorage.getItem('access_token')

export const CONFIG = {
  'headers': {
    'Authorization': `Bearer ${token}`
  }
}

// Admin consts
export const GET_ALL_USERS = 'GET_ALL_USERS'
export const PENDING_USERS = 'PENDING_USERS'
export const PENDING_TAGS = 'PENDING_TAGS'
