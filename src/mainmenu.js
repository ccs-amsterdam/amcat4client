import React from 'react';
import axios from 'axios';
import LoginDialog from './login';
import User from './user';
import Menu from './menu'

export default class MainMenu extends React.Component {
    state = {
        loginDialogOpen: false
    }

    openLogin = () => {
        this.setState({loginDialogOpen: true});
    }

    handleLogin = (host, email, password) => {
        let url = host + "/auth/token/";
        let self = this; // [WvA] Ugh! Is there no nicer way to do this?
        console.log(url);
        axios.get(url, {
            auth: {
                username: email,
                password: password
            }
        }).then(function (response) {
            let u = new User(host, email, response.data.token);
            self.props.onUserChange(u);
            self.setState({ loginDialogOpen: false });
    
        }).catch(function (error) {
            console.log(error)
            alert("Could not log in to server, sorry :-(");
        });

    };

    handleLogout = () => {
        this.props.onUserChange(null);
    }

    render() {
        return <div>
            <Menu user={this.props.user} onLogin={this.openLogin} onLogout={this.handleLogout} />
            <LoginDialog open={this.state.loginDialogOpen} onLogin={this.handleLogin} />
        </div>;
    }
}