import React from 'react';
import { connect } from 'react-redux';
import { setDocuments } from '../actions';

import AmcatIndexSelector from './AmcatIndexSelector';
import DocumentTable from './DocumentTable';
import QueryHelp from './QueryHelp';

import SemanticDatepicker from 'react-semantic-ui-datepickers';
import { Segment, Form, Grid, Button, Icon } from 'semantic-ui-react';

const fields = ['date', 'title', 'url'];

class QueryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: null,
    };
  }

  runQuery = () => {
    this.props.amcat
      .getQuery(
        this.props.amcatIndex.name,
        this.state.query,
        fields,
        '2m',
        100,
        {}
      )
      .then((res) => {
        this.props.setDocuments(res.data.results);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  renderIndexSelector() {
    return (
      <Segment style={{ border: '0' }}>
        <AmcatIndexSelector type="dropdown" />
      </Segment>
    );
  }

  renderQueryWindow() {
    return (
      <Segment style={{ border: '0' }}>
        <Form style={{ marginBottom: '2em' }}>
          <Form.TextArea
            width={16}
            placeholder="Query"
            style={{ height: 200 }}
            onChange={(e, d) =>
              this.setState({
                query: d.value,
              })
            }
          />
        </Form>
        <Form>
          <Button.Group widths="2">
            <Button primary type="submit" onClick={this.runQuery}>
              <Icon name="search" />
              Execute Query
            </Button>
          </Button.Group>
        </Form>
        <QueryHelp />
        <br />
      </Segment>
    );
  }

  renderDocumentTable() {
    return <DocumentTable />;
  }

  render() {
    return (
      <Grid>
        <Grid.Column floated="left" width={6}>
          {this.renderIndexSelector()}
        </Grid.Column>
        <Grid.Column width={10}>
          <Grid.Row>{this.renderQueryWindow()}</Grid.Row>
          <Grid.Row>{this.renderDocumentTable()}</Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }
}

const FilterForms = function ({ fields, fieldValues, setFieldValues }) {
  const onSubmit = (key, value) => {
    const newFieldValues = { ...fieldValues };
    newFieldValues[key] = value;
    setFieldValues(newFieldValues);
  };

  if (!fields) return null;

  return Object.keys(fields).map((key) => {
    if (fields[key] === 'text') {
      return (
        <Form.TextArea
          key={key}
          value={fieldValues[key] ? fieldValues[key] : ''}
          onChange={(e, d) => onSubmit(key, d.value)}
          label={key}
        />
      );
    }
    if (fields[key] === 'date') {
      return (
        <SemanticDatepicker
          key={key}
          type="range"
          label={'from'}
          value={fieldValues[key] ? fieldValues[key] : ''}
          onChange={(e, d) => onSubmit(key, d.value)}
        />
      );
    }
    if (fields[key] === 'keyword') {
      return (
        <Form.Field key={key}>
          <label>{key}</label>
          <input
            value={fieldValues[key] ? fieldValues[key] : ''}
            onChange={(e) => onSubmit(key, e.target.value)}
          />
        </Form.Field>
      );
    }
    return null;
  });
};

const mapStateToProps = (state) => {
  return {
    amcat: state.amcat,
    amcatIndex: state.amcatIndex,
  };
};

export default connect(mapStateToProps, { setDocuments })(QueryForm);
