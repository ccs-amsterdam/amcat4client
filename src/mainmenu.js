import React from 'react';
import LoginDialog from './login';
import User from './user';
import AmcatMenu from './menu';
import * as api from './api';

/**
 * Component that deals with user and index management
 */
export default class MainMenu extends React.Component {
    state = {
        loginDialogOpen: false,
        indices: [],
        indexPickerOpen: false,
    }

    refreshIndices = () => {
        api.getIndices(this.props.user).then((response) => {
                this.setState({indices: response.data, indexPickerOpen: true});    
            });
    }

    openLogin = () => {
        this.setState({loginDialogOpen: true});
    }

    handleIndexPickerClose = (index) => {
        if (index) this.props.onIndexChange(index);
        this.setState({ indexPickerOpen: false});
    }

    handleIndexPickerOpen = () => {
        this.refreshIndices()
        this.setState({indexPickerOpen: true})
    }

    handleLogin = (host, email, password) => {
        api.login(host, email, password).then((response) => {
            let u = new User(host, email, response.data.token);
            this.props.onUserChange(u);
            this.refreshIndices()
            this.setState({ loginDialogOpen: false });
        }).catch(function (error) {
            console.log(error);
            alert("Could not log in to server, sorry :-(");
        });
    };

    handleLogout = () => {
        this.props.onUserChange(null);
    }

    render() {
        return <div>
            <AmcatMenu user={this.props.user} onLogin={this.openLogin}  onLogout={this.handleLogout} 
                       index={this.props.index} indexPickerOpen={this.state.indexPickerOpen} indices={this.state.indices}
                       onIndexPickerClose={this.handleIndexPickerClose} onIndexPickerOpen={this.handleIndexPickerOpen}/>
            <LoginDialog open={this.state.loginDialogOpen} onLogin={this.handleLogin} />
        </div>;
    }
}