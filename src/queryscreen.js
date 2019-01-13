import React from 'react';

import Query from './query'
import Result from './results'
import Output from './output'
import axios from 'axios';

export default class App extends React.Component {
    state = {
        result: null,
    };

    componentDidUpdate(prevProps) {
        if (this.props.project !== prevProps.project) {
            if (!(this.props.project && this.props.user)) {
                this.setState({ result: null });
            } else {
                var config = { headers: { 'Authorization': "Bearer " + this.props.user.token } };
                let url = this.props.user.host + "/projects/" + this.props.project + "/documents";
                let self = this; // [WvA] Ugh! Is there no nicer way to do this?

                axios.get(url, config).then(function (response) {
                    self.setState({result: response.data})
                }).catch(function (error) {
                    console.log(error);
                });

            }

        }
    }

    render() {
        if (this.props.user && this.props.project) {
            return (
                <div>
                    <Query user={this.props.user} />
                    <Output user={this.props.user} />
                    <Result result={this.state.result} />
                </div>
            );
        } else {
            return <p>Please log in or select project</p>
        }
    };
}
