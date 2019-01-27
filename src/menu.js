import React from 'react'
import ReactDOM from 'react-dom';

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Menu from '@material-ui/core/Menu';

export default class AmCATMenu extends React.Component {
    render() {
        let toolbar;
        const open = this.props.indexPickerOpen;
        // [WvA] It seems findDOMNode is discouraged/deprecated, but how else can parent control open and still provide the anchor? 
        // See also https://github.com/mui-org/material-ui/issues/2866
        const menuAnchor = open?ReactDOM.findDOMNode(this.refs.refIndexButton):null;
        const user = this.props.user;
        if (user) {
            let indexmenu = this.props.indices ? // [WvA] For some reason value is always 0 so provide value as function
                this.props.indices.map((index, i) => <MenuItem key={i} value={index.name} onClick={() => this.props.onIndexPickerClose(index.name)}>{index.name}</MenuItem>) :
                <MenuItem>(No indices)</MenuItem>;

            toolbar = <Toolbar>
                <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
                    AmCAT4: {user.host} (user: {user.email}) : {this.props.index}
          </Typography>

                <div>
                    <IconButton
                        aria-owns={open ? 'menu-appbar' : undefined}
                        aria-haspopup="true"
                        onClick={this.props.onIndexPickerOpen}
                        color="inherit"
                        ref="refIndexButton"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu 
                        id="menu-appbar"
                        anchorEl={menuAnchor}
                        open={open}
                        onClose={() => this.props.onIndexPickerClose(null)}
                    >
                        {indexmenu}
                    </Menu>

                </div>

                <Button color="inherit" onClick={this.props.onLogout}>Log out</Button>

            </Toolbar>;
        } else {
            toolbar = <Toolbar>
                <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}> AmCAT4 </Typography>
                <Button color="inherit" onClick={this.props.onLogin}>Log in</Button>
            </Toolbar>;
        }
        return <AppBar position="sticky">{toolbar}</AppBar>;
    }
}