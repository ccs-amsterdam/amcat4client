import React from 'react';
import { connect } from 'react-redux';

import { selectAmcatIndex, setAmcatIndices } from '../actions';

import {
  Header,
  Button,
  Modal,
  Form,
  Dropdown,
  Loader,
  Dimmer,
  Icon,
} from 'semantic-ui-react';

// default roles
const guestRoles = [
  { key: 0, value: 'NONE', text: 'No access' },
  { key: 10, value: 'METAREADER', text: 'Meta-reader' },
  { key: 20, value: 'READER', text: 'Reader' },
  { key: 30, value: 'WRITER', text: 'Writer' },
  { key: 40, value: 'ADMIN', text: 'Admin' },
];

class CreateAmcatIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalStatus: 'inactive',
      newIndexName: '',
      guestRole: 'NONE',
      nameError: '',
    };
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.setState({
      newIndexName: this.state.newIndexName.trim(),
    });

    if (
      this.props.amcatIndices.some((o) => o.name === this.state.newIndexName)
    ) {
      this.setState({
        nameError: 'This project name already exists',
      });
      return;
    }
    this.setState({
      modalStatus: 'pending',
    });
    this.props.amcat
      .createIndex(this.state.newIndexName, this.state.guestRole)
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

  validateName(name) {
    if (name.match(/[ "*|<>/?,A-Z]/)) {
      const invalid = name.match(/[ "*|<>/?]/gi);
      let uniqueInvalid = [...new Set(invalid)].map((c) =>
        c === ' ' ? 'space' : c
      );
      if (name.match(/[A-Z]/)) uniqueInvalid.push('UPPERCASE');
      this.setState({
        nameError: `Illegal symbols: ${uniqueInvalid.join(' ')}`,
      });
    } else {
      this.setState({
        nameError: null,
      });
    }
  }

  render() {
    if (!this.props.amcatIndices) return null;

    return (
      <Modal
        as={Form}
        trigger={
          <Button primary>
            <Icon name="plus" />
            Create New Project
          </Button>
        }
        onSubmit={(e) => this.onSubmit(e)}
        open={this.state.modalStatus !== 'inactive'}
        onClose={() =>
          this.setState({
            modalStatus: 'inactive',
          })
        }
        onOpen={() => {
          this.setState({
            newIndexName: '',
            guestRoles: 'NONE',
            modalStatus: 'awaiting input',
          });
        }}
        size="tiny"
      >
        <Header icon="pencil" content="Create New Project" as="h2" />
        <Modal.Content>
          <Form.Group>
            <Form.Input
              width={12}
              label="Name"
              required
              type="text"
              error={this.state.nameError ? this.state.nameError : null}
              value={this.state.newIndexName}
              onChange={(e, d) => {
                this.validateName(d.value);
                this.setState({
                  newIndexName: d.value,
                  modalStatus: 'awaiting input',
                });
              }}
              placeholder="Enter name"
            />
            <div>
              <b>Guest role</b>
              <br />
              <Form.Input
                width={4}
                label="Name"
                as={Dropdown}
                selection
                value={this.state.guestRole}
                onChange={(e, d) => {
                  this.setState({
                    guestRole: d.value,
                  });
                }}
                options={guestRoles}
              />
            </div>
          </Form.Group>
        </Modal.Content>
        <Modal.Actions>
          {this.state.modalStatus === 'error' ? (
            <div>
              Could not create index for a reason not yet covered in the error
              handling...
            </div>
          ) : null}
          {this.state.modalStatus === 'pending' ? (
            <Dimmer active inverted>
              <Loader content="Creating Project" />
            </Dimmer>
          ) : (
            <Button type="submit" color="green" icon="save" content="Create" />
          )}
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    amcat: state.amcat,
    amcatIndices: state.amcatIndices,
  };
};

export default connect(mapStateToProps, { selectAmcatIndex, setAmcatIndices })(
  CreateAmcatIndex
);
