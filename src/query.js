import React from 'react'
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
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
                <Button variant="contained" color="primary">
                    Query
                    </Button>
            </FormGroup>
        )
    }
}

export default Query;