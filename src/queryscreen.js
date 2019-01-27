import React from 'react';

import Query from './query'
import Result from './results'
import Output from './output'
import * as api from './api';


export default class QueryScreen extends React.Component {
    constructor(props) {
        super(props);
        this.outputOptions = {};
    }

    state = {
        result: null,
        query: null,
        filters: null,
        fields: null,
        page: null, // [WvA] it feels like this state doesn't really belong here. Perhaps refactor into a 'paginatedresult' or something like that?
        per_page: null,
        sortBy: null,
        sortDesc: false,
    };

    componentDidMount = () => {
        if (this.props.user && this.props.index) {
            api.getFields(this.props.user, this.props.index).then((response) => {
                this.get_results({fields :response.data});
            });
        }
    }

    handleOutputOptionsChange = (options) => {
        Object.assign(this.outputOptions, this.outputOptions, options);
    }

    handleQueryChange = (query, filters) => {
        console.log(this.outputOptions);
        this.get_results({query: query, filters: filters, page: null, per_page: null})
    }

    handleChangePage = (e, page) => {
        this.get_results({page: page})
    }

    handleChangeRowsPerPage = (e) => {
        this.get_results({per_page: e.target.value});
    }
    
    handleSort = (column) => {
        // TODO: disable sort on text columns (or better: ask server which columns are sortable)
        if (column === this.state.sortBy) {
            this.get_results({sortDesc: !this.state.sortDesc});
        } else {
            this.get_results({sortBy: column, sortDesc: false});
        }
    }

    /**
     * Refresh results, optionally given new state
     * If new state is given, setState to that query when results are in. 
     * [WvA] setState here and not in handleQueryChange to avoid problem where state is updated only after request is run. I think.
     */
    get_results(new_state={}) {
        // new state should be the old state plus any requested changes
        new_state = Object.assign({}, this.state, new_state) 
        // subset and rename query params from state, drop empty, create query string
        let body = (({ query, page, per_page, sortBy }) => ({ q:query, page, per_page, sort:sortBy }))(new_state);
        if (body.sort && new_state.sortDesc) body.sort = body.sort + ":desc";
        if (new_state.filters) body.filters = new_state.filters;
        // Drop empty keys on body
        Object.keys(body).forEach((key) => body[key] || delete body[key]);        
        
        api.query(this.props.user, this.props.index, body).then((response) => {
            new_state.result  = response.data;
            this.setState(new_state);
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.index !== prevProps.index) {
            if (!(this.props.index && this.props.user)) {
                this.setState({ result: null });
            } else {
                this.get_results()
            }

        }
    }

    render() {
        if (this.props.user && this.props.index && this.state.fields) {
            return (
                <div>
                    <Query user={this.props.user} index={this.props.index} onChange={this.handleQueryChange} fields={this.state.fields} />
                    <Output user={this.props.user} index={this.props.index} fields={this.state.fields} onChange={this.handleOutputOptionsChange} />
                    <Result result={this.state.result} onChangePage={this.handleChangePage} onChangeRowsPerPage={this.handleChangeRowsPerPage} 
                    onSort={this.handleSort} sortBy={this.state.sortBy} sortDesc={this.state.sortDesc} fields={this.state.fields} />
                </div>
            );
        } else {
            return <p>Please log in or select index</p>
        }
    };
}
