import React from 'react';
import { Container, Header, Message } from 'semantic-ui-react';

const Admin = () => {
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
};

export default Admin;
