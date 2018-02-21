import * as ActionTypes from '../actions'
import merge from 'lodash/merge'
import { combineReducers } from 'redux'

// Updates an entity cache in response to any action with response.entities.
const entities = (state = { questions: [] }, action) => {
  console.log('updating Entitites', action)
  if (action.response && action.response.entities) {
    console.log('updating Entitites done')
    return merge({}, state, action.response.entities)
  }
  return state
}

// Updates an entity cache in response to any action with response.entities.
const questions = (state = {ids: [], isFetching: false}, action) => {
  console.log('updating Entitites', action)
  if (action.response && action.response.questions) {
    console.log('updating Questions done', action.response.questions)
    return merge({}, state, action.response.questions)
  }
  return state
}

// Updates error message to notify about the failed fetches.
const errorMessage = (state = null, action) => {
  const { type, error } = action

  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    return error
  }

  return state
}

// All together now
const rootReducer = combineReducers({
  entities,
  questions,
  errorMessage,
})

export default rootReducer
