import React from 'react';

import Query from './query'
import Result from './results'
import Output from './output'

export default class App extends React.Component {
    state = {
        result: null,
    };

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
