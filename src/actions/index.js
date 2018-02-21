import { CALL_API, Schemas } from '../middleware/api'

export const QUESTION_REQUEST = 'QUESTION_REQUEST'
export const QUESTION_SUCCESS = 'QUESTION_SUCCESS'
export const QUESTION_FAILURE = 'QUESTION_FAILURE'

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE'


// Resets the currently visible error message.
export const resetErrorMessage = () => ({
    type: RESET_ERROR_MESSAGE
})

const fetchQuestions = () => ({
  [CALL_API]: {
    types: [ QUESTION_REQUEST, QUESTION_SUCCESS, QUESTION_FAILURE ],
    endpoint: '?amount=10&category=12&difficulty=easy&type=boolean',   //`users/${login}`,
    schema: Schemas.QUESTION_ARRAY
  }
})

export const loadQuestions = () => (dispatch, getState) =>{
console.log('fetching QUESTIONS', Schemas.QUESTION_ARRAY);
  return dispatch(fetchQuestions())
}
