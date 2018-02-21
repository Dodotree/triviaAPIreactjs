/* global window document */

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import  App  from './components/App';
import configureStore from './store/configureStore'

// Grab the state from a global variable injected into the server-generated HTML
// import { normalize, schema } from 'normalizr';
// import { Schemas } from  './middleware/api';
// const data = window.__PRELOADED_STATE__
// Allow the passed state to be garbage-collected
// delete window.__PRELOADED_STATE__

let preloadedState = {
    "entities": {
      "questions": {
      }
    },
    "questions": {
      isFetching: false,
      ids: []
    }
};
const store = configureStore(preloadedState);

const AppClient = () => (
<div>
<Provider store={store}>
  <Router>
    <App store={store}/>
  </Router>
</Provider>
</div>
);

window.onload = () => {
  render(<AppClient />, document.getElementById('main'));
};
