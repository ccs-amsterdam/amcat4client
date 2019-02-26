import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function DocumentViewer(props) {
    if (props.article === null) return <div />
        
    return (
        <Dialog
          open={props.article !== null}
          onClose={props.handleClose}
          scroll='paper'
          aria-labelledby="scroll-dialog-title"
        >

        <DialogTitle id="scroll-dialog-title">{props.article.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {props.article.text}
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
