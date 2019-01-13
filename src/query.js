import React from 'react'
import TextField from '@material-ui/core/TextField';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';

class Query extends React.Component {
    state = {
        autoquery: true,
        query: "",
    }
    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
    };

    doQuery = () => {
        this.props.onChange(this.state.query)
    }

    render() {
        return (
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
                <Button variant="contained" color="primary" onClick={this.doQuery}>
                    Query
                    </Button>
            </FormGroup>
        )
    }
}

export default Query;