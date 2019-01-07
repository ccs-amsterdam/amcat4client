import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';

function Menu(props) {
    let toolbar;
    console.log(props.user);
    if (props.user) {
        toolbar = <Toolbar>
            <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
                AmCAT4: {props.user.host} (user: {props.user.email})
          </Typography>
            <Button color="inherit">Switch Project</Button>
            <Button color="inherit" onClick={props.onLogout}>Log out</Button>
        </Toolbar>;
    } else {
        toolbar = <Toolbar>
            <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}> AmCAT4 </Typography>
            <Button color="inherit" onClick={props.onLogin}>Log in</Button>
        </Toolbar>;
    }

    return <AppBar position="static">{toolbar}</AppBar>;
}

export default Menu;