import React, {useState} from 'react';
import {validateNumber} from "./helpers";
import {guesser} from "./guesser";
import './App.css';

function App() {
  const CODE_LEN = 4;
  const [codeValue, setCodeValue] = useState('0124');
  const [userError, setUserError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [iterations, setIterations] = useState([]);

  const checkCode = (checkedValue) => {
    const error =  validateNumber(checkedValue, CODE_LEN);
    let result = [];

    if(!error) {
      result = guesser(checkedValue, codeValue, CODE_LEN);
      const lastIndex = result.length - 1;
      console.log('______________________', result)
      if(result[lastIndex].countBull === CODE_LEN  || result[lastIndex].tempCow === CODE_LEN ) {
        setSuccessMessage(`You are right! Code is ${checkedValue}. Iterations: ${result.length}`)
      }
    }
    setUserError(error);
    setIterations(result);
  };

  return (
    <div className="App">
      <div className="conceived-number">
        Conceived Number: {codeValue}
      </div>
      <div className="form">
        <input
          type="text"
          maxLength={CODE_LEN}
          className="code-field code-input"
          placeholder="0000"
          onChange={e => setCodeValue(e.target.value)}
          value={codeValue}
        />
        <button className="code-field code-button" onClick={() => checkCode(codeValue)}>Check</button>
      </div>
      {iterations.map((item, index) =>
        <div className="output" key={index}>
          {index + 1}.
          <span className="output-code">[{item.checkedValue}]</span>
          {/*{item.countBull} bull{item.countBull === 1 ? '' : 's'}*/}
          {/*; {item.countCow} cow{item.countCow === 1 ? '' : 's'}*/}
          {item.tempCow} Xcow
        </div>
      )}
      <div className="user-result">
        <span className="user-error">{userError}</span>
        {successMessage && <span className="user-success">{successMessage}</span>}
      </div>
    </div>
  );
}

export default App;
