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
  return async function(dispatch) {
    dispatch({
      type: QUESTION_GET
    })

    let questions = await axios.get(`${API_BASE}/question`)

    dispatch({
      type: QUESTION_GET_SUCCESS,
      payload: questions.data
    })
  }
}

export function createQuestion(data) {
  return async function(dispatch) {
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
  return async function(dispatch) {
    let question = await axios.get(`${API_BASE}/question/${id}`)

    dispatch({
      type: SINGLE_QUESTION_GET,
      payload: question.data.data
    })
  }
}

export function saveEditedAnswer(body) {
  return async function(dispatch) {
    let answer = await axios.put(
      `${API_BASE}/question/answer/edit`,
      body,
      CONFIG
    )

    if (answer.data.status === 200) {
      dispatch(getOneQuestion(body.questionId))
    }
  }
}

export function deleteAnswer(data) {
  return async function(dispatch) {
    let remove = await axios.delete(
      `${API_BASE}/question/${data.questionId}/answer/${data._id}`,
      CONFIG
    )

    console.log(remove)

    dispatch(getOneQuestion(data.questionId))
  }
}

export function getQuestionsLimited(limit) {
  return async function(dispatch) {
    dispatch({
      type: QUESTION_GET
    })

    let questions = await axios.get(`${API_BASE}/questions/limit/${limit}`)

    dispatch({
      type: QUESTION_GET_SUCCESS,
      payload: questions.data
    })
  }
}

export function addAnswer(data) {
  return async function(dispatch) {
    const answer = await axios.post(`${API_BASE}/question/answer`, data, CONFIG)

    if (answer.data.status === 400) {
      alert(answer.data.message)
    }

    dispatch(getOneQuestion(data.questionId))
  }
}

export function likeAnswer(data) {
  return async function(dispatch) {
    if (localStorage.getItem('access_token')) {
      await axios.post(`${API_BASE}/question/answer/like`, data, CONFIG)

      dispatch(getOneQuestion(data.questionId))
    }
  }
}

export function markSolved({ answerId, questionId, toUser, questionAuthor }) {
  return async function(dispatch) {
    await axios.post(
      `${API_BASE}/question/answer/solve`,
      { _id: answerId, questionId, toUser, questionAuthor },
      CONFIG
    )

    dispatch(getOneQuestion(questionId))
  }
}
