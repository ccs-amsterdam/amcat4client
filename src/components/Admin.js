import React from 'react';
import { connect } from 'react-redux';
import history from '../history';
import { setAllUsers } from '../actions';

import {
  Table,
  Grid,
  Item,
  Button,
  Icon,
  Input,
  Modal,
  Header,
  Dropdown,
} from 'semantic-ui-react';

const options = [
  { key: 'admin', text: 'Admin', value: 'ADMIN' },
  { key: 'writer', text: 'Writer', value: 'WRITER' },
];

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      newUsername: '',
      newUserpass: '',
      newUserrole: '',
      updatedIndex: '',
      updatedRole: '',
      selectedUser: {},
    };
  }

  componentDidMount() {
    this.props.amcat.getUsers().then((e) => {
      this.props.setAllUsers(e.data);
    });
  }

  renderCurrentSetting() {
    const currentSetting = [
      {
        title: 'Current Role:',
        path: '#',
        prop: this.props.user,
      },
      {
        title: 'Current Index:',
        path: '/indices',
        prop: this.props.amcatIndex.name,
      },
      {
        title: 'Role over Index:',
        path: '/userManagement',
        prop: `${this.props.amcatIndex.role}`,
      },
    ];

    return currentSetting.map((setting) => {
      return (
        <Item>
          <Item.Content>
            {setting.title}
            <Button
              positive
              floated="right"
              onClick={() => {
                history.push(setting.path);
              }}
            >
              {setting.prop}
              <Icon name="right chevron" />
            </Button>
          </Item.Content>
        </Item>
      );
    });
  }

  renderTableCells() {
    return this.props.allUsers.map((user) => {
      return (
        <Table.Row>
          <Table.Cell>{user.user}</Table.Cell>
          <Table.Cell>{user.index_name}</Table.Cell>
          <Table.Cell>{user.role}</Table.Cell>
          <Table.Cell>
            <Button.Group fluid>
              <Button
                positive
                size="small"
                onClick={() =>
                  this.setState({
                    selectedUser: {
                      oldUser: user.user,
                      role: user.role,
                      index: user.index_name,
                    },
                    openEditModal: true,
                  })
                }
              >
                Edit User
              </Button>
              <Button.Or />
              <Button
                negative
                size="small"
                onClick={() => {
                  this.props.amcat.deleteUser(user.user);
                  let updatedAllUsers = this.props.allUsers.filter((obj) => {
                    return obj.user !== user.user;
                  });

                  this.props.setAllUsers(updatedAllUsers);
                }}
              >
                Delete User
              </Button>
            </Button.Group>
          </Table.Cell>
        </Table.Row>
      );
    });
  }

  renderAdminFuncs() {
    return (
      <Table compact celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={4}>User</Table.HeaderCell>
            <Table.HeaderCell width={3}>Index</Table.HeaderCell>
            <Table.HeaderCell width={3}>Role over Index</Table.HeaderCell>
            <Table.HeaderCell width={4}>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>{this.renderTableCells()}</Table.Body>

        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell colSpan="4">
              <Button
                floated="right"
                icon
                labelPosition="left"
                primary
                size="small"
                onClick={() => {
                  this.setState({ open: true });
                }}
              >
                <Icon name="user" /> Add New User
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }

  renderAddUserModal() {
    return (
      <Modal
        closeIcon
        open={this.state.open}
        size="small"
        onClose={() => this.setState({ open: false })}
        onOpen={() => this.setState({ open: true })}
      >
        <Header icon="user" content="Create new user" />
        <Modal.Content>
          <Input
            label="Username"
            placeholder="..."
            style={{ marginRight: '1rem' }}
            onChange={(e) => {
              this.setState({
                newUsername: e.target.value,
              });
            }}
          />

          <Input
            label="Password"
            placeholder="..."
            style={{ marginRight: '1rem' }}
            onChange={(e) => {
              this.setState({
                newUserpass: e.target.value,
              });
            }}
          />

          <Dropdown
            button
            basic
            floating
            value={this.state.newUserrole}
            options={options}
            onChange={(e, { value }) => {
              this.setState({
                newUserrole: value,
              });
            }}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="red"
            onClick={() => {
              this.setState({ open: false });
            }}
          >
            <Icon name="remove" /> Cancel
          </Button>
          <Button
            color="green"
            onClick={() => {
              this.props.amcat
                .createUser(
                  this.state.newUsername,
                  this.state.newUserpass,
                  this.state.newUserrole,
                  true,
                  this.props.amcatIndex.name
                )
                .then((e) => {
                  this.props.allUsers.push({
                    index_name: this.props.amcatIndex.name,
                    role: this.state.newUserrole,
                    user: this.state.newUsername,
                  });
                  this.props.setAllUsers(this.props.allUsers);
                  this.setState({ open: false });
                });
            }}
          >
            <Icon name="checkmark" /> Add
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  renderUserEditModal() {
    return (
      <Modal
        closeIcon
        open={this.state.openEditModal}
        size="large"
        fluid
        onClose={() => this.setState({ openEditModal: false })}
        onOpen={() => this.setState({ openEditModal: true })}
      >
        <Header
          icon="user"
          content={`Edit user ${this.state.selectedUser.user}`}
        />

        <Modal.Content>
          <Input
            label="Email"
            placeholder={this.state.selectedUser.oldUser}
            style={{ marginRight: '1rem' }}
            onChange={(e) => {
              this.setState({
                selectedUser: {
                  ...this.state.selectedUser,
                  user: e.target.value,
                },
              });
            }}
          />

          <Input
            label="Password"
            placeholder="..."
            style={{ marginRight: '1rem' }}
            onChange={(e) => {
              this.setState({
                selectedUser: {
                  ...this.state.selectedUser,
                  password: e.target.value,
                },
              });
            }}
          />

          <Input
            label="Index"
            placeholder={this.state.selectedUser.index}
            style={{ marginRight: '1rem' }}
            onChange={(e) => {
              this.setState({
                selectedUser: {
                  ...this.state.selectedUser,
                  index: e.target.value,
                },
              });
            }}
          />

          <Dropdown
            button
            basic
            floating
            value={this.state.selectedUser.role}
            options={options}
            onChange={(e, { value }) => {
              this.setState({
                selectedUser: {
                  ...this.state.selectedUser,
                  role: value,
                },
              });
            }}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="red"
            onClick={() => {
              this.setState({ openEditModal: false });
            }}
          >
            <Icon name="remove" /> Cancel
          </Button>
          <Button
            color="green"
            onClick={() => {
              this.props.amcat
                .modifyUser(
                  this.state.selectedUser.oldUser,
                  this.state.selectedUser.user,
                  this.state.selectedUser.password,
                  this.state.selectedUser.index,
                  this.state.selectedUser.role
                )
                .then((e) => {
                  this.props.allUsers.push({
                    index_name: this.state.selectedUser.index,
                    role: this.state.selectedUser.role,
                    user: this.state.selectedUser.user,
                  });
                  this.props.setAllUsers(this.props.allUsers);
                  this.setState({ openEditModal: false });
                });
            }}
          >
            <Icon name="checkmark" /> Edit
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  render() {
    return (
      <Grid celled="internally">
        <Grid.Row>
          <Grid.Column width={16} floated="left">
            <h3>Current User and Access:</h3>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16} floated="left">
            <Item.Group divided>{this.renderCurrentSetting()}</Item.Group>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16} floated="left">
            <h3 style={{ marginTop: '50px' }}>Administrative Tasks:</h3>
            {this.renderAdminFuncs()}
            {this.renderAddUserModal()}
            {this.renderUserEditModal()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    amcat: state.amcat,
    user: state.amcat.email,
    host: state.amcat.host,
    amcatIndex: state.amcatIndex,
    allUsers: state.allUsers,
  };
};

export default connect(mapStateToProps, { setAllUsers })(Admin);
