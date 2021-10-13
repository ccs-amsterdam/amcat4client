import React from 'react';
import { connect } from 'react-redux';
import {
  Segment,
  Grid,
  Container,
  Form,
  Button,
  Icon,
  Item,
} from 'semantic-ui-react';

import Modal from './modal';
import history from '../history';
import TextareaAutosize from 'react-textarea-autosize';
import QueryHelp from './QueryHelp';
import { setDocuments, setQueryString, setLatestQueries } from '../actions';

class Home extends React.Component {
  renderCurrentSetting() {
    const currentSetting = [
      {
        title: 'Current Project:',
        path: '/indices',
        prop: this.props.amcatIndex
          ? this.props.amcatIndex.name
          : 'No Project Selected!',
      },
      {
        title: 'Role in Project:',
        path: this.props.amcatIndex ? './userManagement' : '/indices',
        prop: this.props.amcatIndex
          ? `${this.props.amcatIndex.role}`
          : 'No Project Selected',
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
        <Item key={setting.title}>
          <Item.Content>
            {setting.title}
            <Button
              size="small"
              positive
              floated="right"
              onClick={() => {
                history.push(setting.path);
              }}
            >
              {setting.prop}
              <Icon name="right chevron" />
            </Button>
          </Item.Content>
        </Item>
      );
    });
  }

  renderCoreFunctionalities() {
    const corefuncs = [
      {
        title: 'Select Project:',
        path: '/indices',
        btnText: 'Manage Project!',
      },
      {
        title: 'Upload Documents:',
        path: '/indices',
        btnText: 'Manage Documents!',
      },
      {
        title: 'Run Queries:',
        path: '/query',
        btnText: 'Run Queries',
      },
      {
        title: 'User Management',
        path: this.props.amcatIndex ? './userManagement' : './indices',
        btnText: this.props.amcatIndex
          ? 'Manage User Access!'
          : 'No Project Selected',
      },
    ];

    return corefuncs.map((funcs) => {
      return (
        <Item key={funcs.title}>
          <Item.Content>
            {funcs.title}
            <Button
              size="small"
              primary
              floated="right"
              onClick={() => {
                history.push(funcs.path);
              }}
            >
              {funcs.btnText}
              <Icon name="right chevron" />
            </Button>
          </Item.Content>
        </Item>
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
        <Item key={plugIn.title}>
          <Item.Content>
            {plugIn.title}
            <Button
              size="small"
              floated="right"
              onClick={() => {
                history.push(plugIn.path);
              }}
            >
              {plugIn.btnText}
              <Icon name="right chevron" />
            </Button>
          </Item.Content>
        </Item>
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

  renderQueryWindow() {
    return (
      <Grid>
        <Grid.Column width={16} style={{ marginBottom: '50px' }}>
          <h2>Quick Start:</h2>
          <Form style={{ marginBottom: '2em' }}>
            <TextareaAutosize
              width={16}
              value={this.props.queryString ? this.props.queryString : ''}
              style={{ height: 20 }}
              placeholder={`Run a Query on ${
                this.props.amcatIndex ? this.props.amcatIndex.name : '...'
              }`}
              onChange={(e) => this.props.setQueryString(e.target.value)}
            />
          </Form>

          <Form>
            <Button.Group widths="2">
              <Button primary type="submit" onClick={() => this.runQuery()}>
                <Icon name="search" />
                Execute Query
              </Button>
            </Button.Group>
          </Form>
          <QueryHelp />
          <br />
        </Grid.Column>
      </Grid>
    );
  }

  runQuery() {
    this.props.amcat
      .postQuery(
        this.props.amcatIndex.name,
        this.props.queryString,
        // this.fields,
        '',
        '2m',
        100,
        {},
        {}
      )
      .then((res) => {
        this.props.setDocuments(res.data.results);
        this.addToQueryStrings(this.props.queryString);
        history.push('/query');
      })
      .catch((e) => {
        console.log(e);
      });
  }

  addToQueryStrings(query) {
    let queryStrings = [...this.props.latestQueries];
    if (!queryStrings.includes(query)) {
      queryStrings.unshift(query);
    }
    this.props.setLatestQueries(queryStrings);
  }

  renderAmcatLogo() {
    return (
      <React.Fragment>
        <img
          className="ui centered medium image"
          src="/media/AmCATLogo.png"
          alt="AmCAT Logo"
        />
        <div
          className="ui one column stackable center aligned page grid"
          style={{ marginTop: '15px', marginBottom: '30px' }}
        ></div>
      </React.Fragment>
    );
  }

  renderHome() {
    return (
      <Container>
        <h2>Hello {this.props.user}</h2>
        <Grid>
          <Grid.Column floated="left" width={16}>
            <Grid.Row>
              <Segment style={{ border: '1' }}>
                <div className="content">
                  <h4>Here are your current settings:</h4>
                </div>
                <Item.Group divided>{this.renderCurrentSetting()}</Item.Group>
              </Segment>
              <Segment style={{ border: '1' }}>
                <h4>Core Funcionalities</h4>
                <Item.Group divided>
                  {this.renderCoreFunctionalities()}
                </Item.Group>
              </Segment>
              <Segment style={{ border: '1' }}>
                <h4>AmCAT Plugins</h4>
                <Item.Group divided>{this.renderAmcatPlugins()}</Item.Group>
              </Segment>
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }

  renderModal() {
    if (!this.props.amcatIndex) {
      return (
        <Modal
          title="You have not selected an project yet!"
          content="Please take me to the select project page!"
          actions={this.renderActions()}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={16} floated="left">
            {this.renderAmcatLogo()}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16} floated="left">
            {this.renderQueryWindow()}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16} floated="left">
            {this.renderModal()}
            {this.props.amcatIndex && this.renderHome()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    amcat: state.amcat,
    user: state.amcat.email,
    host: state.amcat.host,
    amcatIndex: state.amcatIndex,
    queryString: state.queryString,
    latestQueries: state.latestQueries,
  };
};

export default connect(mapStateToProps, {
  setDocuments,
  setQueryString,
  setLatestQueries,
})(Home);
