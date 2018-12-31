import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';

export default class LoginDialog extends React.Component {
    state = {
        open: true,
    };
    handleFormChange = name => event => {
        this.setState({ [name]: event.target.value });
    };
    doLogin = (event) => {
        console.log(this.state);
        let url = this.state.server + "/auth/token/";
        axios.get(url, {
            auth: {
                username: this.state.email,
                password: this.state.password
            }
        }).then(function (response) {
            let token = response.data.token;
            alert("Logged in! " + token);
            console.log(token);
            this.setState({ open: false });
        }).catch(function (error) {
            console.log('Error on Authentication');
            alert("Could not log in to server, sorry :-(");
        });

    };

    render() {
        return (
            <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Log in!
            </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="server"
                        label="Server"
                        onChange={this.handleFormChange('server')}
                        fullWidth
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email Address"
                        type="email"
                        onChange={this.handleFormChange('email')}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        onChange={this.handleFormChange('password')}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.doLogin} color="primary">
                        Login
            </Button>
                </DialogActions>
            </Dialog>
        );
    }
}