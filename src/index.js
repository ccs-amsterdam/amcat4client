import React from 'react';
import ReactDOM from 'react-dom';
import MainMenu from './mainmenu.js'
import QueryScreen from './queryscreen'


export default class App extends React.Component {
  state = {
    user: null, 
    project: null,
  };

  handleUserChange = (new_user) => {
    this.setState({user: new_user, project: null})
  }
  handleProjectChange = (new_project) => {
    this.setState({project: new_project})
  }
  render() {

    return (
      <div>
        <MainMenu user={this.state.user}  onUserChange={this.handleUserChange} 
                  project={this.state.project} onProjectChange={this.handleProjectChange} />
        <QueryScreen user={this.state.user} project={this.state.project} />
      </div>

    );
  }
}
ReactDOM.render(<App />, document.querySelector('#root'));