import React from 'react';

import Query from './query'
import Result from './results'
import Output from './output'
import axios from 'axios';

export default class QueryScreen extends React.Component {
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
        if (this.props.user && this.props.project) {
            const url = this.props.user.host + "/projects/" + this.props.project + "/fields";
            const config = { headers: { 'Authorization': "Bearer " + this.props.user.token } };

            axios.get(url, config).then((response) => {
                this.get_results({fields :response.data});
            }).catch((error) => {
                console.log(error);
            });
        }
    }

    handleQueryChange = (query, filters) => {
        this.get_results({query: query, filters: filters, page: null, per_page: null, sortBy: null, sortDesc: false})
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
        let url = this.props.user.host + "/projects/" + this.props.project + "/query";

        // new state should be the old state plus any requested changes
        new_state = Object.assign({}, this.state, new_state) 
        // subset and rename query params from state, drop empty, create query string
        let body = (({ query, page, per_page, sortBy }) => ({ q:query, page, per_page, sort:sortBy }))(new_state);
        if (body.sort && new_state.sortDesc) body.sort = body.sort + ":desc";
        if (new_state.filters) body.filters = new_state.filters;
        // Drop empty keys on body
        Object.keys(body).forEach((key) => body[key] || delete body[key]);        
        
        var config = { headers: { 'Authorization': "Bearer " + this.props.user.token } };
        console.log({url, config, body});
        axios.post(url, body, config).then((response) => {
            new_state.result  = response.data;
            this.setState(new_state);
        }).catch((error) => {
            console.log(error);
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.project !== prevProps.project) {
            if (!(this.props.project && this.props.user)) {
                this.setState({ result: null });
            } else {
                this.get_results()
            }

        }
    }

    render() {
        if (this.props.user && this.props.project && this.state.fields) {
            return (
                <div>
                    <Query user={this.props.user} project={this.props.project} onChange={this.handleQueryChange} fields={this.state.fields} />
                    <Output user={this.props.user} />
                    <Result result={this.state.result} onChangePage={this.handleChangePage} onChangeRowsPerPage={this.handleChangeRowsPerPage} 
                    onSort={this.handleSort} sortBy={this.state.sortBy} sortDesc={this.state.sortDesc} fields={this.state.fields} />
                </div>
            );
        } else {
            return <p>Please log in or select project</p>
        }
    };
}
