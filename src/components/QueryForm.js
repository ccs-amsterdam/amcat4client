import React from 'react';
import { connect } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import _ from 'lodash';

import TimeSeriesPlot from './TimeSeriesPlot';
import { setDocuments, setQueryString, setLatestQueries } from '../actions';

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
          if (value === null || value === '') {
            console.log('here');
            dateFilter.range = _.omit(dateFilter.range, rangeIndicator);
          } else dateFilter.range[rangeIndicator] = value;
        }
        obj['date'] = dateFilter;
      } else {
        obj[filter[0]] = { value: filter[1] };
      }
      return obj;
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
            // this.fields,
            '',
            '2m',
            100,
            {},
            { ...this.prepareFilters() }
          )
          .then((res) => {
            this.props.setDocuments(res.data.results);
            this.addToQueryStrings(this.props.queryString);
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
            this.addToQueryStrings(this.props.queryString);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  };

  addToQueryStrings(query) {
    let queryStrings = [...this.props.latestQueries];
    queryStrings.unshift(query);
    this.props.setLatestQueries(queryStrings);
  }

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
        <Grid columns={2}>
          <Grid.Column width={12}>
            <Form style={{ marginBottom: '2em' }}>
              <TextareaAutosize
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
          </Grid.Column>
          <Grid.Column width={4}>
            <Grid.Row>{this.renderLatestQueriesList()}</Grid.Row>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }

  renderFilters() {
    const active = this.state.accordionActive ? 'active' : '';

    return (
      <div className="ui styled fluid accordion">
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

  renderLatestQueriesList() {
    return (
      <React.Fragment>
        <h4>Latest Queries:</h4>
        <Button.Group vertical widths={2}>
          {this.props.latestQueries.map((queryString, idx) => {
            if (queryString.length < 2 || idx > 4) return null;
            return (
              <Button
                fluid
                style={{ marginBottom: '0.5em' }}
                onClick={async () => {
                  await this.props.setQueryString(queryString);
                  this.runQuery();
                }}
              >
                {queryString.length > 20
                  ? queryString.slice(0, 17) + '...'
                  : queryString}
              </Button>
            );
          })}
        </Button.Group>
      </React.Fragment>
    );
  }

  renderDocumentTable() {
    return <DocumentTable />;
  }

  renderTimeSeriesPlot() {
    return <TimeSeriesPlot />;
  }

  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <Grid.Row>{this.renderIndexSelector()}</Grid.Row>
            <Grid.Row>{this.renderQueryWindow()}</Grid.Row>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={16}>
            <Grid.Row>
              <div>
                <h4>Quick Filters:</h4>
                <QuickFilters runQuery={this.runQuery} />
              </div>
            </Grid.Row>
            <Grid.Row>{this.renderDocumentTable()}</Grid.Row>
            <Grid.Row>
              {this.props.documents.length > 1 && this.renderTimeSeriesPlot()}
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
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
    latestQueries: state.latestQueries,
    documents: state.documents,
  };
};

export default connect(mapStateToProps, {
  setDocuments,
  setQueryString,
  setLatestQueries,
})(QueryForm);
