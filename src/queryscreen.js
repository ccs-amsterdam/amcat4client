import React from 'react';

import Query from './query'
import Result from './results'
import Output from './output'
import axios from 'axios';

export default class App extends React.Component {
    state = {
        result: null,
        query: null,
    };

    handleQueryChange = (query) => {
        this.setState({query: query})
        this.get_results()
    }

    get_results() {
        var config = { headers: { 'Authorization': "Bearer " + this.props.user.token } };
        let url = this.props.user.host + "/projects/" + this.props.project + "/documents";
        if (this.state.query) url = url + "?q=" + this.state.query;
        console.log(url);
        let self = this; // [WvA] Ugh! Is there no nicer way to do this?
        axios.get(url, config).then(function (response) {
            self.setState({result: response.data})
        }).catch(function (error) {
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
