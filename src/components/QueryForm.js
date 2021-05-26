import React from 'react';
import { connect } from 'react-redux';
import { setDocuments } from '../actions';

import AmcatIndexSelector from './AmcatIndexSelector';
import DocumentTable from './DocumentTable';
import QueryHelp from './QueryHelp';
import FilterForms from './FilterForms';

import { Segment, Form, Grid, Button, Icon } from 'semantic-ui-react';

class QueryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: null,
    };
    this.fields = Object.keys(this.props.fields);
  }

  runQuery = () => {
    this.props.amcat
      .getQuery(
        this.props.amcatIndex.name,
        this.state.query,
        this.fields,
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
          <Grid.Row>{this.renderIndexSelector()}</Grid.Row>
          <Grid.Row>
            <FilterForms />
          </Grid.Row>
        </Grid.Column>
        <Grid.Column width={10}>
          <Grid.Row>{this.renderQueryWindow()}</Grid.Row>
          <Grid.Row>{this.renderDocumentTable()}</Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    amcat: state.amcat,
    amcatIndex: state.amcatIndex,
    fields: state.indexFields,
  };
};

export default connect(mapStateToProps, { setDocuments })(QueryForm);
