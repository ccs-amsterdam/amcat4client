import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';

function Menu() {
    return(
        <div>
        <AppBar position="static">
            <Toolbar>
          <Typography variant="h6" color="inherit" style = {{flexGrow: 1}}>
            AmCAT4: vu.amcat.nl >> project X
          </Typography>
          <Button color="inherit">Switch Project</Button>
          <Button color="inherit">Log out</Button>
        </Toolbar>


        </AppBar>
        </div>
    )
}

export default Menu;