import React from 'react'
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';
import User from './user';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';

export default class Query extends React.Component {
    static propTypes = {
        user: PropTypes.instanceOf(User).isRequired,
        fields: PropTypes.object.isRequired,
        onchange: PropTypes.func,
    };
    static defaultProps = {
        onChange: console.log
    }

    state = {
        autoquery: true,
        query: "",
        filters: [],
        values: {}, // 'cached' {fieldname : [values]} 
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    }

    addFilter = () => {
        let new_filter = { id: this.state.filters.length };
        this.setState({
            filters: [...this.state.filters, new_filter]
        });
    }

    removeFilter = (fieldid) => {
        let filters = this.state.filters.filter((field, id) => id !== fieldid);
        this.setState({filters});
    }

    doQuery = () => {
        console.log(this.state.filters);
        // convert filters from array to dict as required by query endpoint
        let filters = {};
        for (let f of this.state.filters) {
            if (f.value) filters[f.fieldname] = {'value': f.value};
            console.log(f);
        }
        console.log(filters);
        this.props.onChange(this.state.query, filters)
    }

    setFilterName = (field, name) => {
        const ftype = this.props.fields[name];
        const f = { ...this.state.filters[field], fieldname: name }
        if (ftype === "date") {
            f["value_from"] = '';
            f["value_to"] = '';
        } else {
            f["value"] = '';
        }
        // set mutated field in array position on fields array
        let nf = [...this.state.filters];
        nf[field] = f;

        this.setState({ filters: nf });

        // Get possible values for this field if needed
        if (ftype === "keyword" && !(field in this.state.values)) {
            let url = this.props.user.host + "/projects/" + this.props.project + "/fields/" + name + "/values";
            let config = { headers: { 'Authorization': "Bearer " + this.props.user.token } };
            axios.get(url, config).then((response) => {
                let values = { ...this.state.values, [name]: response.data }
                this.setState({ values })
            }).catch((error) => {
                console.log(error);
            });
    
        }
    }

    setFilterValue = (field, value) => {
        const f = Object.assign({}, this.state.filters[field], value);
        let nf = [...this.state.filters];
        nf[field] = f;
        this.setState({ filters: nf });
    }

    render_field_picker = (field) => {
        var ftype = this.props.fields[field.fieldname];
        if (ftype === "date") {
            return <div>
                <TextField
                    id="from"
                    label="From"
                    type="date"
                    value={field.value_from}
                    onChange={(event) => this.setFilterValue(field.id, { value_from: event.target.value })}
                    InputLabelProps={{ shrink: true, }}
                />
                <TextField
                    id="to"
                    label="To"
                    type="date"
                    value={field.value_to}
                    onChange={(event) => this.setFilterValue(field.id, { value_to: event.target.value })}
                    InputLabelProps={{ shrink: true, }}
                />
            </div>
        } else if (ftype === "keyword") {
            if (!(field.fieldname in this.state.values)) return <div>Getting values...</div>
            return <FormControl style={{ minWidth: 120 }}>
            <InputLabel htmlFor="values">Value</InputLabel>
            <Select
                value={field.value}
                onChange={(event) => this.setFilterValue(field.id, { value: event.target.value})}
                inputProps={{
                    name: 'values',
                    id: 'values',
                }}
            >{this.state.values[field.fieldname].map(field => <MenuItem key={field} value={field}>{field}</MenuItem>)}
            </Select>
        </FormControl>

        } else {
            return <FormControl style={{ minWidth: 120 }}>
                <InputLabel htmlFor="value">Value</InputLabel>
                <Input id="value" value={field.value} onChange={(event) => this.setFilterValue(field.id, { value: event.target.value })} />
            </FormControl>
        }
    }

    render_field_select = (field) => {
        return <FormGroup row key={field.id}>
        <IconButton aria-label="Delete" onClick={() => this.removeFilter(field.id)} >
          <DeleteIcon fontSize="small"/>
        </IconButton>
            <FormControl style={{ minWidth: 120 }}>
                <InputLabel htmlFor="fieldname">Field</InputLabel>
                <Select
                    value={field.fieldname || ""}
                    onChange={(event) => this.setFilterName(field.id, event.target.value)}
                    inputProps={{
                        name: 'fieldname',
                        id: 'fieldname',
                    }}
                >{Object.keys(this.props.fields)
                    .filter((field) => this.props.fields[field] !== 'text')
                    .map(field => <MenuItem key={field} value={field}>{field}</MenuItem>)}
                </Select>
            </FormControl>
            {field.fieldname && this.render_field_picker(field)}
        </FormGroup>
    }

    render() {
        return <div>
            <FormGroup row>
                <TextField
                    id="query"
                    label="Query"
                    style={{ margin: 8 }}
                    placeholder="Enter your query text"
                    fullWidth
                    margin="normal"
                    onChange={this.handleChange('query')}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </FormGroup>
            {this.state.filters.map(this.render_field_select)}
            <FormGroup row>
                <Button variant="contained" color="default" onClick={this.addFilter}>
                    Add Filter
                </Button> &nbsp; 
                <Button variant="contained" color="secondary" onClick={this.doQuery}>
                    Query
                </Button>
            </FormGroup>
        </div>
    }
}
