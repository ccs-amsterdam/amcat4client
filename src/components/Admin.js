import React from 'react';
import { RECORD_SEP } from 'react-papaparse';
import { connect } from 'react-redux';

import { Container, Header, Message } from 'semantic-ui-react';

class Admin extends React.Component {
  render() {
    return (
      <Container>
        <>
          <Header textAlign="center">User Management</Header>
          <Message
            header="I am the user management page"
            content="And here should be some stuff that you show for CRUD users, role changes, ..."
          />
        </>
      </Container>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, {})(Admin);
