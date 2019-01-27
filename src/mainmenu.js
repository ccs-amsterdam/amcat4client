import React from 'react';
import LoginDialog from './login';
import User from './user';
import AmcatMenu from './menu';
import * as api from './api';

/**
 * Component that deals with user and project management
 */
export default class MainMenu extends React.Component {
    state = {
        loginDialogOpen: false,
        projects: [],
        projectPickerOpen: false,
    }
    refreshProjects = () => {
        api.getProjects(this.props.user).then((response) => {
                this.setState({projects: response.data, projectPickerOpen: true});    
            });
    }
    openLogin = () => {
        this.setState({loginDialogOpen: true});
    }

    handleProjectPickerClose = (project) => {
        if (project) this.props.onProjectChange(project);
        this.setState({ projectPickerOpen: false});
    }

    handleProjectPickerOpen = () => {
        this.refreshProjects()
        this.setState({projectPickerOpen: true})
    }

    handleChangeProject = (project) => {}

    handleLogin = (host, email, password) => {
        api.login(host, email, password).then((response) => {
            let u = new User(host, email, response.data.token);
            this.props.onUserChange(u);
            this.refreshProjects()
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
                       project={this.props.project} projectPickerOpen={this.state.projectPickerOpen} projects={this.state.projects}
                       onProjectPickerClose={this.handleProjectPickerClose} onProjectPickerOpen={this.handleProjectPickerOpen}/>
            <LoginDialog open={this.state.loginDialogOpen} onLogin={this.handleLogin} />
        </div>;
    }
}