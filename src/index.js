import React from 'react';
import ReactDOM from 'react-dom';
import MainMenu from './mainmenu.js'
import QueryScreen from './queryscreen'


export default class App extends React.Component {
  state = {
    user: null,
  };

  handleUserChange = (new_user) => {
    this.setState({user: new_user})
  }

  render() {

    return (
      <div>
        <MainMenu user={this.state.user} onUserChange={this.handleUserChange} />
        <QueryScreen user={this.state.user} />
      </div>

    );
  }
}
ReactDOM.render(<App />, document.querySelector('#root'));