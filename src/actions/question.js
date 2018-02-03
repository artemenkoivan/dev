import axios from 'axios'
import {
  QUESTION_GET,
  QUESTION_GET_SUCCESS,
  API_BASE,
  QUESTION_NEW,
  CONFIG,
  QUESTION_NEW_SUCCESS,
  SINGLE_QUESTION_GET
} from '../helpers/consts'

export function getQuestions() {
  return async function (dispatch) {
    dispatch({
      type: QUESTION_GET
    })

    let questions = await axios.get(`${API_BASE}/question`)

    dispatch({
      type: QUESTION_GET_SUCCESS,
      payload: questions.data.data
    })
  }
}

export function createQuestion(data) {
  return async function (dispatch) {
    dispatch({
      type: QUESTION_NEW
    })

    let question = await axios.post(`${API_BASE}/question`, data, CONFIG)

    if (question.status === 200) {
      dispatch({
        type: QUESTION_NEW_SUCCESS
      })
      
      dispatch(getQuestions())
    }
  }
}

export function getOneQuestion(id) {
  return async function (dispatch) {

    let question = await axios.get(`${API_BASE}/question/${id}`)

    dispatch({
      type: SINGLE_QUESTION_GET,
      payload: question.data.data
    })
  }
}

export function addAnswer(data) {
  return async function (dispatch) {
    const answer = await axios.post(`${API_BASE}/question/answer`, data, CONFIG)

    if (answer.data.status === 400) {
      alert(answer.data.message)
    }

    dispatch(getOneQuestion(data.questionId))
  }
}

export function likeAnswer(data) {
  return async function (dispatch) {
    if (localStorage.getItem('access_token')) {
      await axios.post(`${API_BASE}/question/answer/like`, data, CONFIG)

      dispatch(getOneQuestion(data.questionId))
    }
  }
}

export function markSolved({ answerId, questionId }) {
  return async function(dispatch) {
    await axios.post(`${API_BASE}/question/answer/solve`, { _id: answerId, questionId }, CONFIG)

    dispatch(getOneQuestion(questionId))
  }
}
