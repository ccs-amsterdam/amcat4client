import React from 'react';
import { connect } from 'react-redux';
import { Segment, Grid, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import history from '../history';
import Modal from './modal';

class Home extends React.Component {
  renderCurrentSetting() {
    const currentSetting = [
      {
        title: 'Current Index:',
        path: '/indices',
        prop: this.props.amcatIndex.name,
      },
      {
        title: 'Role over Index:',
        path: '/userManagement',
        prop: `Current Role over Index: ${this.props.amcatIndex.role}`,
      },
      {
        title: 'Last Query:',
        path: '/query',
        prop: this.props.queryString
          ? this.props.queryString
          : 'No Previous Queries',
      },
      {
        title: 'Remaining Tasks:',
        path: '#',
        prop: 'ToDo',
      },
    ];

    return currentSetting.map((setting) => {
      return (
        <div
          key={setting.title}
          className="item"
          onMouseEnter={(e) => (e.target.style.background = '#DCDCDC')}
          onMouseLeave={(e) => (e.target.style.background = 'white')}
        >
          {setting.title}
          <div className="ui green horizontal label large">
            <Link to={setting.path}>{setting.prop}</Link>
          </div>
        </div>
      );
    });
  }

  renderCoreFunctionalities() {
    const corefuncs = [
      {
        title: 'Select and index:',
        path: '/indices',
        btnText: 'Manage Indices!',
      },
      {
        title: 'Upload documents:',
        path: '/indices',
        btnText: 'Manage Documents!',
      },
      {
        title: 'Run queries:',
        path: '/query',
        btnText: 'Run Queries on Index!',
      },
      {
        title: 'Manage users and their access:',
        path: '/userManagement',
        btnText: 'Manage User Access!',
      },
    ];

    return corefuncs.map((funcs) => {
      return (
        <div
          className="item"
          key={funcs.title}
          onMouseEnter={(e) => (e.target.style.background = '#DCDCDC')}
          onMouseLeave={(e) => (e.target.style.background = 'white')}
        >
          {funcs.title}
          <div className="ui blue left pointing horizontal label">
            <Link to={funcs.path}>{funcs.btnText}</Link>
          </div>
        </div>
      );
    });
  }

  renderAmcatPlugins() {
    const Plugins = [
      {
        title: 'AmCAT Annotator:',
        path: '#',
        btnText: 'ToDo',
      },
      {
        title: 'Run NLP Methods:',
        path: '#',
        btnText: 'ToDo',
      },
      {
        title: 'Non-consumptive Research:',
        path: '#',
        btnText: 'ToDo',
      },
    ];

    return Plugins.map((plugIn) => {
      return (
        <div
          className="item"
          key={plugIn.title}
          onMouseEnter={(e) => (e.target.style.background = '#DCDCDC')}
          onMouseLeave={(e) => (e.target.style.background = 'white')}
        >
          {plugIn.title}
          <div className="ui blue left pointing horizontal label">
            <Link to={plugIn.path}>{plugIn.btnText}</Link>
          </div>
        </div>
      );
    });
  }

  renderActions() {
    return (
      <React.Fragment>
        <button
          className="ui button primary"
          onClick={() => history.push('/indices')}
        >
          Lets go!
        </button>
      </React.Fragment>
    );
  }

  renderModal() {
    if (!this.props.amcatIndex) {
      return (
        <Modal
          title="You have not selected an index yet!"
          content="Please take me to the select index page!"
          actions={this.renderActions()}
          // onDismiss={() => history.push('/')}
        />
      );
    }
    return null;
  }

  renderHome() {
    return (
      <Container>
        <Grid>
          <Grid.Column floated="left" width={16}>
            <Grid.Row>
              <img
                className="ui centered large image"
                src="/media/AmCATLogo.png"
                alt="AmCAT Logo"
              />
              <div
                className="ui one column stackable center aligned page grid"
                style={{ marginTop: '8px' }}
              >
                <h2>Welcome to AmCAT 4.0 (AKA AmKitten)</h2>
              </div>
              <Segment style={{ border: '0' }}>
                <div className="content">
                  <h2>Hello {this.props.user}</h2>
                  <h4>Here are your current settings:</h4>
                </div>
                <div className="ui fluid vertical menu center">
                  {this.renderCurrentSetting()}
                </div>
              </Segment>
              <Segment style={{ border: '0' }}>
                <h4>Core Funcionalities</h4>
                <div className="ui fluid vertical menu center">
                  {this.renderCoreFunctionalities()}
                </div>
                <h4>AmCAT Plugins</h4>
                <div className="ui fluid vertical menu center">
                  {this.renderAmcatPlugins()}
                </div>
              </Segment>
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }

  render() {
    return (
      <div>
        {this.renderModal()}
        {this.props.amcatIndex && this.renderHome()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.amcat.email,
    host: state.amcat.host,
    amcatIndex: state.amcatIndex,
    queryString: state.queryString,
  };
};

export default connect(mapStateToProps, {})(Home);
