import React from 'react';
import ReactDOM from 'react-dom';
import Menu from './menu.js'
import Query from './query'
import Result from './results'
import Output from './output'


function App() {
  return (
    <div>
      <Menu />
      <Query />
      <Output />
      <Result />
    </div>
    
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));