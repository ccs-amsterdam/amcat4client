import React from 'react';
import axios from 'axios';
import LoginDialog from './login';
import User from './user';
import AmcatMenu from './menu';

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
        // refresh projects
        var config = {headers: {'Authorization': "Bearer " + this.props.user.token}};
        let url = this.props.user.host + "/projects/";
        let self = this; // [WvA] Ugh! Is there no nicer way to do this?

        axios.get(url, config).then(function (response) {
                self.setState({projects: response.data, projectPickerOpen: true});    
            }).catch(function (error) {
                console.log(error);
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
        let url = host + "/auth/token/";
        let self = this; // [WvA] Ugh! Is there no nicer way to do this?
        axios.get(url, {
            auth: {
                username: email,
                password: password
            }
        }).then(function (response) {
            let u = new User(host, email, response.data.token);
            self.props.onUserChange(u);
            self.refreshProjects()
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
            <AmcatMenu user={this.props.user} onLogin={this.openLogin}  onLogout={this.handleLogout} 
                       project={this.props.project} projectPickerOpen={this.state.projectPickerOpen} projects={this.state.projects}
                       onProjectPickerClose={this.handleProjectPickerClose} onProjectPickerOpen={this.handleProjectPickerOpen}/>
            <LoginDialog open={this.state.loginDialogOpen} onLogin={this.handleLogin} />
        </div>;
    }
}