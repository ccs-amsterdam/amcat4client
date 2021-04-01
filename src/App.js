import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import HeaderMenu from "./components/HeaderMenu";
import { Divider, Container } from "semantic-ui-react";

// login and authenticated route
import AmcatLogin from "./components/AmcatLogin";
import AuthRoute from "./components/AuthRoute";

// Main pages. Use below in items to include in header menu
import Query from "./components/Query";
import Create from "./components/Create";

// Change to add new components to the header
// The first item will be the opening page after login
const items = [
  { label: "Query", path: "/query", Component: Query },
  { label: "Create", path: "/create", Component: Create },
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
    <BrowserRouter>
      <HeaderMenu items={items} />
      <Divider />
      <Container style={{ marginTop: "3em" }}>
        <Switch>
          <Route exact path="/" render={() => <AmcatLogin items={items} />} />
          {createNavigation(items)}
        </Switch>
      </Container>
    </BrowserRouter>
  );
};

export default App;
