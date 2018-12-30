import React from 'react';
import ReactDOM from 'react-dom';
import Menu from './menu.js'
import Query from './query'
import Result from './results'
import Output from './output'
import Login from './login'

function App() {

  return (
    <div>
      <Login />
      <Menu />
      <Query />
      <Output />
      <Result />
    </div>
    
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));