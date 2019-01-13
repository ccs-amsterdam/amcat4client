import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

const TabContainer = (props) => {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

class Output extends Component {
    state = {
        value: 0,
    };
    handleChange = (event, value) => {
        this.setState({ value });
    };
    render() {
        const { value } = this.state;

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
                    {value === 0 && <TabContainer>(options for documents)</TabContainer>}
                    {value === 1 && <TabContainer>(options for summary)</TabContainer>}
                    {value === 2 && <TabContainer>(options for table)</TabContainer>}
                    {value === 3 && <TabContainer>(options for graph)</TabContainer>}
                    {value === 4 && <TabContainer>(options for script)</TabContainer>}
                    </AppBar>
                </div>
        );
    }
}

export default Output;