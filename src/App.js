import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import HeaderMenu from './components/HeaderMenu';
import { Divider, Container } from 'semantic-ui-react';
import history from './history';

// login and authenticated route
import AmcatLogin from './components/AmcatLogin';
import AuthRoute from './components/AuthRoute';

// Main pages. Use below in items to include in header menu
import Home from './components/Home';

import Admin from './components/Admin';
import Indices from './components/Indices';
import Query from './components/Query';
import DocumentDetail from './components/DocumentDetail';

// Change to add new components to the header
// The first item will be the opening page after login
const items = [
  { label: 'Home', path: './home', Component: Home },
  {
    label: 'Manage Projects',
    path: './indices',
    position: 'left',
    Component: Indices,
  },
  { label: 'Run Queries', path: './query', Component: Query },
  // { label: 'Browse Index', path: '/indexDetail', Component: IndexDetail },
  {
    label: 'Browse Document',
    path: './browseDocument',
    Component: DocumentDetail,
  },
  {
    label: 'Manage Users and Access',
    path: './userManagement',
    position: 'right',
    Component: Admin,
  },
];

const App = () => {
  const createNavigation = (items) => {
    return items.map((item) => {
      return (
        <AuthRoute
          key={item.path}
          path={item.path}
          Component={item.Component}
        />
      );
    });
  };

  return (
    <Router history={history}>
      <HeaderMenu items={items} />
      <Divider />
      <Container style={{ marginTop: '4em' }}>
        <Switch>
          <Route exact path="/" render={() => <AmcatLogin items={items} />} />
          {createNavigation(items)}
        </Switch>
      </Container>
    </Router>
  );
};

export default App;
