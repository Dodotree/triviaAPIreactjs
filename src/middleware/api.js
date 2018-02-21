import { normalize, schema } from 'normalizr';
import fetch from 'cross-fetch';


/* Action key */
export const CALL_API = 'Call API'

const API_ROOT = 'https://opentdb.com/api.php'

// Actual ajax call that returnes promise and resolves it
// then  normalizes the result JSON according to schema.
// This makes every API response have the same shape, regardless of how nested it was.
const callApi = (endpoint, schema) => {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1) ? API_ROOT + endpoint : endpoint
  //  returns middleware function callApi
  console.log('API Return AJAX call function', fullUrl);
  return fetch(fullUrl)
    .then(response => {  
        return response.json().then(json => {
            if (!response.ok) { return Promise.reject(json) }
            // next page url for pagination if any
            // creating new (partial)state object with normalized result + pagination
            // it's returned to the reducer, reducer will change state to a new one 
            // by merging this new partial one from response with current state
            let res = ('undefined' !== typeof json.results) ? json.results : {}
            for( let i=0; i<res.length; i++ ){
                res[i].id = i
            }
            console.log(res)
            let normRes = normalize(res, schema)
            console.log('norm results', normRes)
            const nextPageUrl = ''
            let ret = Object.assign({}, normRes, { nextPageUrl })
            ret.questions = {ids: normRes.result, isFetching: false}
            console.log(ret)
            return ret
        })
    })
}


// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {

console.log('API enter point', action);

  const callAPI = action[CALL_API] // action[CALL_API] should have "types", "endpint" and "schema"

  if (typeof callAPI === 'undefined') { return next(action) }


  let { endpoint } = callAPI
  // resolve if it's a function
  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }
  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }

  const { schema, types } = callAPI
  if (!schema) {
    throw new Error('Specify one of the exported Schemas.', callAPI)
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }
  const [ requestType, successType, failureType ] = types

console.log('API create actionModifier to form action for next() middleware');
  // create function for removing our used params and feeding the rest to the next middleware (reducer)
  const actionWith = data => {
    const finalAction = Object.assign({}, action, data)
    // remove our used params action[CALL_API]: "types", "endpint" and "schema"
    delete finalAction[CALL_API]
    // the rest is action for the next middleware reducer
console.log('API next(actionWith()) called', finalAction);
    return finalAction
  }
  // resolve syncronous next() first to take care of isFetching etc.
console.log('API sync next() call');
  next(actionWith({ type: requestType }))

console.log('API Return async api call function: (promise) with .then(Success next(), Fail next()) attached');
  return callApi(endpoint, schema).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  )
}

const questionSchema = new schema.Entity('questions',
    { },
    {
      idAttribute: question => question.id
    });

export const Schemas = {
  QUESTION: questionSchema,
  QUESTION_ARRAY: [questionSchema]
}
/* End of set Schemas */

