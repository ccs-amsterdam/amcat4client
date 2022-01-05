import React from 'react';
import { useDispatch } from 'react-redux';
import { AmcatLogin } from 'amcat4auth';
import { createAmcatSession } from '../actions';
import { Container, Header, Image } from 'semantic-ui-react';
import { useHistory } from 'react-router';

export default function LoginScreen({ items }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const onLogin = (amcat) => {
    dispatch(createAmcatSession(amcat));
    history.push(items[0].path);
  };

  return (
    <Container textAlign="center">
      <Header as="h2" color={'blue'} textAlign="center">
        <Image src="/amcat-logo.svg" /> Connect to AmCAT server
      </Header>
      <AmcatLogin onLogin={onLogin} />
    </Container>
  );
}
