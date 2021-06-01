import React from 'react';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import _ from 'lodash';

import history from '../history';
import { setDocuments, setQueryString } from '../actions';

import AmcatIndexSelector from './AmcatIndexSelector';
import DocumentTable from './DocumentTable';
import QueryHelp from './QueryHelp';
import FilterForms from './FilterForms';
import QuickFilters from './QuickFilters';

import { Segment, Form, Grid, Button, Icon } from 'semantic-ui-react';

class QueryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryMethod: 'POST',
      accordionActive: false,
    };
    this.fields = Object.keys(this.props.fields);
  }

  prepareFilters() {
    this.setState({
      queryMethod: 'POST',
    });
    const obj = {};
    const dateFilter = {
      range: {},
    };
    Object.entries(this.props.filters).map((filter) => {
      if (filter[0] === 'date') {
        for (const [rangeIndicator, value] of Object.entries(filter[1])) {
          if (value === null) {
            dateFilter.range = _.omit(dateFilter.range, rangeIndicator);
          } else dateFilter.range[rangeIndicator] = value;
        }
        obj['date'] = dateFilter;
      } else {
        obj[filter[0]] = { value: filter[1] };
      }
    });

    return obj;
  }

  runQuery = (method = 'GET') => {
    if (!this.props.amcatIndex) return;
    switch (method) {
      case 'POST': {
        this.props.amcat
          .postQuery(
            this.props.amcatIndex.name,
            this.props.queryString,
            this.fields,
            '2m',
            100,
            {},
            { ...this.prepareFilters() }
          )
          .then((res) => {
            this.props.setDocuments(res.data.results);
          })
          .catch((e) => {
            console.log(e);
          });
        return null;
      }
      default: {
        this.props.amcat
          .getQuery(
            this.props.amcatIndex.name,
            this.props.queryString,
            this.fields,
            '2m',
            100,
            {},
            {
              ...this.props.filters,
            }
          )
          .then((res) => {
            this.props.setDocuments(res.data.results);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  };

  renderIndexSelector() {
    return (
      <React.Fragment>
        <AmcatIndexSelector type="dropdown" />
      </React.Fragment>
    );
  }

  renderQueryWindow() {
    return (
      <Segment style={{ border: '0' }}>
        <Form style={{ marginBottom: '2em' }}>
          <TextareaAutosize
            width={16}
            value={this.props.queryString ? this.props.queryString : ''}
            style={{ height: 20 }}
            placeholder="Query..."
            onChange={(e) => this.props.setQueryString(e.target.value)}
          />
        </Form>
        <Form style={{ marginBottom: '2em' }}>{this.renderFilters()}</Form>
        <Form>
          <Button.Group widths="2">
            <Button
              primary
              type="submit"
              onClick={() => this.runQuery(this.state.queryMethod)}
            >
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

  renderFilters() {
    const active = this.state.accordionActive ? 'active' : '';

    return (
      <div className="ui styled accordion">
        <div
          className={`title ${active}`}
          onClick={(e) => {
            e.stopPropagation();
            this.setState({
              accordionActive: !this.state.accordionActive,
            });
          }}
        >
          <i className=" dropdown icon"></i>
          Show All Filters
        </div>
        <div className={`content ${active}`}>
          <FilterForms />
        </div>
      </div>
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
          <Grid.Row>{this.renderQueryWindow()}</Grid.Row>
        </Grid.Column>
        <Grid.Column width={10}>
          <Grid.Row>
            <div>
              <h4>Quick Filters:</h4>
              <QuickFilters runQuery={this.runQuery} />
            </div>
          </Grid.Row>
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
    filters: state.fieldValues,
    queryString: state.queryString,
  };
};

export default connect(mapStateToProps, { setDocuments, setQueryString })(
  QueryForm
);
