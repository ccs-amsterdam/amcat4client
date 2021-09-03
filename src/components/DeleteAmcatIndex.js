import React from 'react';
import { connect } from 'react-redux';

import { selectAmcatIndex, setAmcatIndices } from '../actions';

import { Button, Header, Icon, Modal, Dimmer, Loader } from 'semantic-ui-react';

class DeleteAmcatIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalStatus: 'inactive',
    };
  }

  onSubmit = (event) => {
    this.setState({
      modalStatus: 'pending',
    });

    this.props.amcat
      .deleteIndex(this.props.amcatIndex.name)
      .then((res) => {
        // maybe check for 201 before celebrating
        if (this.props.amcat) {
          this.props.amcat.getIndices().then((res) => {
            this.props.selectAmcatIndex(null);
            this.props.setAmcatIndices(res.data);
          });
        }
        this.setState({
          modalStatus: 'inactive',
        });
      })
      .catch((e) => {
        console.log(e.message);
        console.log(e);
        this.setState({
          modalStatus: 'error',
        });
      });
  };

  render() {
    return (
      <Modal
        closeIcon
        open={this.state.modalStatus !== 'inactive'}
        trigger={
          <Button disabled={!this.props.amcatIndex} name="delete index">
            <Icon name="minus" /> Delete Index
          </Button>
        }
        onClose={() => {
          this.setState({
            modalStatus: 'inactive',
          });
        }}
        onOpen={() => {
          this.setState({
            modalStatus: 'awaiting input',
          });
        }}
      >
        <Header
          icon="trash"
          content={`Delete Index ${
            this.props.amcatIndex ? this.props.amcatIndex.name : null
          }`}
        />
        <Modal.Content>
          <p>Do you really want to delete this Index?</p>
        </Modal.Content>
        <Modal.Actions>
          {this.state.modalStatus === 'error' ? (
            <div>
              Could not delete index for a reason not yet covered in the error
              handling...
            </div>
          ) : null}
          {this.state.modalStatus === 'pending' ? (
            <Dimmer active inverted>
              <Loader content="Creating Index" />
            </Dimmer>
          ) : (
            <>
              <Button
                color="green"
                onClick={() =>
                  this.setState({
                    modalStatus: 'inactive',
                  })
                }
              >
                <Icon name="remove" /> No
              </Button>
              <Button color="red" onClick={this.onSubmit}>
                <Icon name="checkmark" /> Yes
              </Button>
            </>
          )}
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    amcat: state.amcat,
  };
};

export default connect(mapStateToProps, { selectAmcatIndex, setAmcatIndices })(
  DeleteAmcatIndex
);
