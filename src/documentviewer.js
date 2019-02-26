import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const text_style = {
    'padding': '40px 30px',
    'white-space': 'pre-line',
    'backgroundColor': 'WhiteSmoke',
    'line-height': '1',
    'text-align': 'justify',
    'elevation': '24',
  };

const meta_style = {
    'padding': '20px 30px',
    'line-height': '1',
    'text-align': 'left',
}

function splitParagraphs(text) {
    let pars = text.split('\n')
    for (var i in pars) {
        pars[i] = <Typography component="p" style={{'margin-bottom' : '15px'}}>{pars[i]}</Typography>
    }
    return pars
}

function makeBody(props) {
    let add_text = []
    for (var key in props.fields) {
        if (props.fields[key] !== "text") continue
        if (key === 'title') continue
        if (props.article.hasOwnProperty(key)) {   
            if (key !== 'text') add_text.push(<Typography component="h4" style={{'text-align': 'center', 'color': 'black'}}>{key}</Typography>) 
            add_text.push(splitParagraphs(props.article[key]))
        }
    }
        
    return (
        <Paper style={text_style}>
            <Typography variant="h5" component="h3" style={{'text-align': 'center'}}>{props.article.title}</Typography> 
            <span><br/><br/></span>
            {add_text}
        </Paper>
    )
}

function makeMeta(props) {
    let f = []
    for (var key in props.fields) {
        if (props.fields[key] === "text") continue
        if (props.article.hasOwnProperty(key)) {   
            f.push(<ListItem><ListItemText primary={key} secondary={props.article[key]}/></ListItem>)
        }
    }

    return (
        <List style={meta_style}>
            {f}
        </List>
    )
}

function DocumentViewer(props) {
    if (props.article === null) return <div />
        
    console.log(props.fields)

    return (
        <Dialog
          maxWidth='md'
          open={props.article !== null}
          onClose={props.onClose}
          scroll='paper'
          aria-labelledby="scroll-dialog-title"
        >

        <DialogTitle id="scroll-dialog-title"></DialogTitle>
          <DialogContent>
            <DialogContentText>
                <Grid container spacing={12}>
                    <Grid item xs={8}>
                        {makeBody(props)}
                    </Grid>
                    <Grid item xs={4}>
                        {makeMeta(props)}
                    </Grid>
                </Grid>

            </DialogContentText>
          </DialogContent>
          
        <DialogActions>
            <Button onClick={props.onClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
    );
}

export default DocumentViewer;
