import React from 'react'
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';

class Query extends React.Component {
    state = {
        autoquery: true,
    }
    handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    render() {
        return (
            <FormGroup row>
                <TextField
                    id="standard-full-width"
                    label="Query"
                    style={{ margin: 8 }}
                    placeholder="Enter your query text"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={this.state.autoquery}
                            onChange={this.handleChange('autoquery')}
                            value="autoquery"
                        />
                    }
                    label="Query Automatically"
                />
                <Button variant="contained" color="primary" disabled={this.state.autoquery}>
                    Query
                    </Button>
            </FormGroup>
        )
    }
}

export default Query;