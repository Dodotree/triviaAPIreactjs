import React from 'react';
import { QuestionCard } from './QuestionCard';

export const IndexPage = ({ questions, url, handleValidation, reloadPage, results }) => (
  <div className="home">
    <form onSubmit={handleValidation}>
    <div className="athletes-selector">
      {questions.map(
        questionData => <QuestionCard url={url} key={questionData.id} {...questionData} />,
      )}
    </div>
    <button type="submit">Get result</button>
    <input type="button" value="Play again" onClick={reloadPage}/>
    </form>
    <div>
      {(results) &&
        <div>
        <b>Right:</b>{results.Right}, <b>Wrong:</b>{results.Wrong}, <b>Skipped:</b>{results.Skipped}
        </div>
      }
    </div>
  </div>
);

export default IndexPage;
