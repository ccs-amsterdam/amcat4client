import React from 'react';

import Query from './query'
import Result from './results'
import Output from './output'
import axios from 'axios';

export default class QueryScreen extends React.Component {
    state = {
        result: null,
        query: null,
    };

    handleQueryChange = (query) => {
        this.get_results(query)
    }

    /**
     * Refresh results, optionally given a new query
     * If new query is given, setState to that query when results are in. 
     * [WvA] setState here and not in handleQueryChange to avoid problem where state is updated only after request is run
     */
    get_results(query=null) {
        console.log(query)
        var q=query!=null?query:this.state.query;
        var config = { headers: { 'Authorization': "Bearer " + this.props.user.token } };
        let url = this.props.user.host + "/projects/" + this.props.project + "/documents";
        if (q) url = url + "?q=" + q;
        console.log(url);
        axios.get(url, config).then((response) => {
            let state = {result: response.data}
            if (query) state['query'] = query;
            console.log(state);
            this.setState(state);
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
        if (this.props.user && this.props.project) {
            return (
                <div>
                    <Query user={this.props.user} onChange={this.handleQueryChange} />
                    <Output user={this.props.user} />
                    <Result result={this.state.result} />
                </div>
            );
        } else {
            return <p>Please log in or select project</p>
        }
    };
}
