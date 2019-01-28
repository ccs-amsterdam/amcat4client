import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import User from './user';
import { ListItemText, MenuItem, Checkbox, FormControl, InputLabel, Select, Input, FormGroup } from '@material-ui/core';

const TabContainer = (props) => {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

export default class Output extends React.Component {
    static propTypes = {
        user: PropTypes.instanceOf(User).isRequired,
        index: PropTypes.string.isRequired,
        fields: PropTypes.object.isRequired,
    };

    state = {
        selected_tab: "document",
        document_fields: [],
        table_options: { row: { 'field': 'date', 'interval': 'day' }, column: {'interval': 'day'} }
    };

    onDocumentFieldsChange = (event) => {
        let fields = event.target.value;
        this.setState({ document_fields: fields });
        this.props.onChange({ document: { fields: fields } });
    }

    setTableFieldOptions = (axis, options) => {
        let new_axis_options = {...this.state.table_options[axis], ...options};
        let new_options = {...this.state.table_options, [axis]: new_axis_options};
        this.setState({ table_options: new_options});
        this.props.onChange({ table: new_options });
    }

    handleOutputSelected = (selected_tab) => {
        this.setState({ selected_tab });
        this.props.onChange({ output: selected_tab });
    };

    componentDidMount = () => {
        // [WvA] pass state defaults to parent. This might be a hint that keeping state here is not 'reactive'?
        this.props.onChange({ output: this.state.selected_tab, table: this.state.table_options });
    }


    documentOptions() {
        return <FormControl>
            <InputLabel htmlFor="field-picker">Columns</InputLabel>
            <Select
                multiple
                value={this.state.document_fields}
                onChange={this.onDocumentFieldsChange}
                input={<Input id="select-multiple-checkbox" />}
                renderValue={selected => selected.join(', ')}
                style={{ minWidth: 120 }}
            >
                {Object.keys(this.props.fields).map(name => (
                    <MenuItem key={name} value={name}>
                        <Checkbox checked={this.state.document_fields.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    }

    tableOptions() {
        let rows = [{ key: 'row', label: 'Rows', nullable: false }, { key: 'column', label: 'Columns', nullable: true }].map(axis => {
            let field = this.state.table_options[axis.key];
            let ftype = field.field ? this.props.fields[field.field] : '';
            let intervalpicker = null;
            if (ftype === 'date') {
                intervalpicker = <FormControl style={{ minWidth: 120 }}>
                     <InputLabel htmlFor="interval">Date interval</InputLabel>
                     <Select
                        value={field.interval || ""}
                        onChange={(event) => this.setTableFieldOptions(axis.key, {interval: event.target.value})}
                        inputProps={{ name: axis.key + "-interval", id: axis.key + "-interval" }}
                    >
                        {["Year", "Month", "Week", "Day"].map(interval => <MenuItem key={interval} value={interval.toLowerCase()}>{interval}</MenuItem>)}
                    </Select>
                </FormControl>
            } 
            return <FormGroup row key={axis.key}>
                <FormControl style={{ minWidth: 120 }}>
                    <InputLabel htmlFor={axis.key + "-fieldname"}>{axis.label}</InputLabel>
                    <Select
                        value={field.field || ""}
                        onChange={(event) => this.setTableFieldOptions(axis.key, {field: event.target.value})}
                        inputProps={{ name: axis.key + "-fieldname", id: axis.key + "-fieldname" }}
                    >
                        {axis.nullable && <MenuItem key="null" value=""></MenuItem>}
                        {Object.keys(this.props.fields)
                            .filter((field) => ["keyword", "date"].includes(this.props.fields[field]))
                            .map(field => <MenuItem key={field} value={field}>{field}</MenuItem>)}
                    </Select>
                </FormControl>
                {intervalpicker}
            </FormGroup>
        });

        return <div>{rows}</div>
    }

    render() {
        let selected_tab = this.state.selected_tab;
        let options = null;
        if (selected_tab === "document") options = this.documentOptions();
        if (selected_tab === "table") options = this.tableOptions();

        return (
            <div style={{ marginTop: 20 + 'px', marginBottom: 20 + 'px' }}>
                <AppBar position="static" color="default">
                    <Tabs
                        value={selected_tab}
                        onChange={(event, value) => this.handleOutputSelected(value)}
                        indicatorColor="primary"
                        textColor="primary"
                        scrollable
                        scrollButtons="auto"
                    >
                        <Tab value="document" label="Documents" />
                        <Tab value="table" label="Table" />
                        <Tab value="graph" label="Graph" disabled />
                        <Tab value="script" label="Script" disabled />
                    </Tabs>
                    {options && <TabContainer>{options}</TabContainer>}
                </AppBar>
            </div>
        );
    }
}
