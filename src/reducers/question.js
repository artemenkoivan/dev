import {
  QUESTION_GET,
  QUESTION_GET_SUCCESS,
  QUESTION_GET_FAILURE,
  SINGLE_QUESTION_GET
} from '../helpers/consts'
import { Map } from 'immutable'

const initialState = new Map({
  questions: [],
  noQuestions: '',
  singleQuestion: '',
  pendingQuestions: false
})

function questionReducer(state = initialState, action) {

  switch (action.type) {
    case QUESTION_GET:
      return state
        .set('pendingQuestions', true)

    case QUESTION_GET_SUCCESS:
      return state 
        .set('questions', action.payload)
        .set('pendingQuestions', false)
        
    case QUESTION_GET_FAILURE: 
      return state 
        .set('noQuestions', action.payload)
        .set('pendingQuestions', false)
    case SINGLE_QUESTION_GET:
      return state
        .set('singleQuestion', action.payload)
    default:
      return state
  }
}

export default questionReducer