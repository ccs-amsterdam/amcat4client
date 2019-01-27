import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import User from './user';
import { ListItemText, MenuItem, Checkbox, FormControl, InputLabel, Select, Input } from '@material-ui/core';

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
        value: 0,
        document_fields: [],
    };

    onDocumentFieldsChange = (event) => {
        let fields = event.target.value;
        this.setState({document_fields: fields });
        this.props.onChange({document: {fields: fields}});
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

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

    render() {
        const { value } = this.state;

        let options = null;
        if (value === 0) options = this.documentOptions();

        return (
                <div style={{ marginTop: 20 + 'px', marginBottom: 20 + 'px' }}>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={value}
                            onChange={this.handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            scrollable
                            scrollButtons="auto"
                        >
                            <Tab label="Documents" />
                            <Tab label="Summary" />
                            <Tab label="Table" />
                            <Tab label="Graph" />
                            <Tab label="Script" />
                        </Tabs>
                    {options && <TabContainer>{options}</TabContainer>}
                    </AppBar>
                </div>
        );
    }
}
