import React from 'react';

import Query from './query'
import Result from './results'
import ResultsTable from './results_table'
import DocumentViewer from './documentviewer'
import Output from './output'
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import * as api from './api';

export default class QueryScreen extends React.Component {
    constructor(props) {
        super(props);
        this.outputOptions = {output: 'document', document: {}, table: {}}; 
         // [WvA] I don't think this needs to be state as it is a read-only copy of output state. Same might actually hold for query etc.
         // [WvA] OTOH maybe it's actually better to keep the state here and pass to the children. 
        this.query = {}
    }

    state = {
        result: null,
        filters: null,
        fields: null,
        page: null, // [WvA] it feels like this state doesn't really belong here. Perhaps refactor into a 'paginatedresult' or something like that?
        per_page: null,
        sortBy: null,
        sortDesc: false,
        popup_article: null,
    };

    componentDidMount = () => {
        if (this.props.user && this.props.index) {
            api.getFields(this.props.user, this.props.index).then((response) => {
                this.get_results({fields :response.data});
            });
        }
    }

    handleOutputOptionsChange = (options) => {
        console.log(options);
        Object.assign(this.outputOptions, this.outputOptions, options);
    }

    handleQueryChange = (query) => {
        Object.assign(this.query, this.query, query);
    }

    handleChangePage = (e, page) => {
        this.get_results({page: page})
    }

    handleChangeRowsPerPage = (e) => {
        this.get_results({per_page: e.target.value});
    }

    handlePopupOpen = (row) => {
        api.getDocument(this.props.user, this.props.index, row).then(response => {
            console.log(response)
            this.setState({popup_article: response.data})
        })
    }

    handlePopupClose = () => {
        this.setState({popup_article: null})
    }

    doQuery = () => {
        this.get_results({page: null, per_page: null})
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
        let results = null;
        if (this.outputOptions.output === "document") results = this.get_results_documents(new_state);
        else if (this.outputOptions.output === "table") results = this.get_results_table(new_state);
        else throw Error("Unknown output "+this.outputOptions.output);

        results.data.then((response) => {
            new_state.result = {type: results.type, data: response.data};
            this.setState(new_state);
        });
    }

    get_results_documents(new_state) {
        let body = (({ page, per_page, sortBy }) => ({ page, per_page, sort:sortBy }))(new_state);
        if (body.sort && new_state.sortDesc) body.sort = body.sort + ":desc";
        body.query_string = this.query.query_string
        body.filters = this.query.filters
        body.fields = this.outputOptions.document.fields;
        // Drop empty keys on body
        Object.keys(body).forEach((key) => body[key] || delete body[key]);        
        console.debug(body);
        return {type: "list", data: api.query(this.props.user, this.props.index, body)}
    }

    get_results_table() {
        let clean = val => {
            if (this.state.fields[val.field] !== "date") val = {field: val.field}
            return val
        }
        let body = {axes: [clean(this.outputOptions.table.row)], 
            filters: this.query.filters,
            query_string: this.query.query_string
        }
        if (this.outputOptions.table.column.field) body.axes.push(clean(this.outputOptions.table.column))

        Object.keys(body).forEach((key) => body[key] || delete body[key]);        
        console.debug(body);
        return {type: "table", data: api.aggregate(this.props.user, this.props.index, body)}
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
            let result = null;
            if (this.state.result.type === "list") result = <Result result={this.state.result.data} onChangePage={this.handleChangePage} onChangeRowsPerPage={this.handleChangeRowsPerPage} 
            onSort={this.handleSort} sortBy={this.state.sortBy} sortDesc={this.state.sortDesc} fields={this.state.fields} onClickRow={this.handlePopupOpen} />;
            else if (this.state.result.type === "table") result = <ResultsTable options={this.outputOptions.table} result={this.state.result.data} fields={this.state.fields} />

            return (
                <div>
                    <Query user={this.props.user} index={this.props.index} fields={this.state.fields} onChange={this.handleQueryChange} />
                    <Output user={this.props.user} index={this.props.index} fields={this.state.fields} onChange={this.handleOutputOptionsChange} />
                <Button variant="contained" color="secondary" onClick={this.doQuery}>Query</Button>
                <Divider variant="middle" style={{margin:".5em"}}/>
                {result}    
                <DocumentViewer article={this.state.popup_article} onClose={this.handlePopupClose} />
                </div>
            );
        } else {
            return <p>Please log in and select index</p>
        }
    };
}
