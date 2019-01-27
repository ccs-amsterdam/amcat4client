import React from 'react';
import ReactDOM from 'react-dom';
import MainMenu from './mainmenu.js'
import QueryScreen from './queryscreen'


export default class App extends React.Component {
  state = {
    user: null, 
    index: null,
  };

  handleUserChange = (new_user) => {
    this.setState({user: new_user, index: null})
  }
  handleIndexChange = (new_index) => {
    this.setState({index: new_index})
  }
  render() {
    // Key is unique for user + index so if it changes the queryscreen needs to be refreshed
    let key = this.state.user && this.state.index ? this.state.user.email + ":" + this.state.index : null;
    return (
      <div>
        <MainMenu user={this.state.user}  onUserChange={this.handleUserChange} 
                  index={this.state.index} onIndexChange={this.handleIndexChange} />
        <QueryScreen user={this.state.user} index={this.state.index} key={key} />
      </div>

    );
  }
}
ReactDOM.render(<App />, document.querySelector('#root'));