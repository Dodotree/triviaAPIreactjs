import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import serialize from 'form-serialize';
import { Provider, connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Layout } from './Layout';
import { IndexPage } from './IndexPage';
import { NotFoundPage } from './NotFoundPage';
import { loadQuestions } from  '../actions'; 


class App extends Component {

  constructor(props) {
    super(props);
    console.log('App constructor: props', props);
    let sto = props.store.getState();
    this.state = {
        date: new Date(), 
        url: '/images/',
        questions: getQuestionsFromStore(sto),
        results: null
    };
  }

  reloadPage () {
    window.location.reload()
  }

  componentWillMount() {
    console.log('App: componentWillMount, trigger first api call');
    // triggers API sync+Async Action Creator from "actions"(action creators)
    this.props.disp('questions');
  }

  componentDidMount() {
    console.log('App: componentDidMount ', this);
  }

  componentDidUpdate(prevProps, prevState) {
    let stt = this.props.store.getState()
    console.log('App: componentDidUpdate ', prevProps.question_ids, this.props.question_ids);
    if( // prevProps.isFetching && !this.props.isFetching 
          (JSON.stringify(prevProps.question_ids) !== JSON.stringify(this.props.question_ids)) ){
        let sto = this.props.store.getState();
        this.setState((prevState) => {
            return {questions: getQuestionsFromStore(sto)}
        });
    }
  }

  componentWillUnmount() {
  }

  render() {
    const url = this.state.url;
    const handleValidation = (e) => {
        e.preventDefault()
        let data = serialize(e.target, { hash: true })
        console.log(data)
        let res = {Skipped: 10, Right:0, Wrong: 0}
        if('undefined' !== typeof data.radio){
            for(var i=0; i<data.radio.length; i++) res[data.radio[i]]++
            res.Skipped = 10-data.radio.length
        }
        console.log(res, this)
        this.results = res
        this.props.history.replace('/')
      }

    return (
      <Layout url={url}>
        <Switch>
          <Route exact path="/" 
            component={() => <IndexPage handleValidation={handleValidation} 
                                        reloadPage={this.reloadPage} 
                                        questions={this.state.questions} 
                                        results={this.results}
                                        url={url}/>} />
          <Route component={NotFoundPage} />
        </Switch>
      </Layout>
    );
  }
}

const getIsFetching = (state, key) => (state.questions)? state.questions.isFetching : false;

const getQuestionIdsFromStore = (state) => {
    let ttt = ('undefinded' !== typeof state.questions) ? state.questions.ids.slice() : []
    console.log('State questions', ttt )
    return ttt
};

const getQuestionsFromStore = (state) => {
    console.log('getQuestionsFromStore', state, state.entities.questions)
    let questions = [];
    if(!state.questions) return []
    for(let i=0; i<state.questions.ids.length; i++){
        let q_id = state.questions.ids[i];
        questions.push(state.entities.questions[q_id]);
    }
    console.log( 'Questions=', questions)
  return questions;
}

const mapStateToProps = (state, { params }) => ({
    isFetching: getIsFetching(state,'questions'),
    question_ids: getQuestionIdsFromStore(state) 
})

export default App = withRouter(connect(mapStateToProps, {disp: loadQuestions})(App));


