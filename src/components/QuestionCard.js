import React from 'react';

export const QuestionCard = props => (
    <div className="">
      <h2 className="name">Question #{props.id}</h2>
      <p>{props.question}</p>
      <div> Yes 
        <input type="radio" 
          value={(props.correct_answer === 'True') ? 'Right' : 'Wrong'} 
          name={`radio[${props.id}]`}>
        </input>
      </div>
      <div> No 
        <input type="radio" 
          value={(props.correct_answer === 'True') ? 'Wrong' : 'Right'}
          name={`radio[${props.id}]`}>
        </input>
      </div>
    </div>
);

export default QuestionCard;
