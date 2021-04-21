import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import HeaderMenu from "./components/HeaderMenu";
import { Divider, Container } from "semantic-ui-react";

// login and authenticated route
import AmcatLogin from "./components/AmcatLogin";
import AuthRoute from "./components/AuthRoute";

// Main pages. Use below in items to include in header menu
import Indices from "./components/Indices";
import Query from "./components/Query";

// Change to add new components to the header
// The first item will be the opening page after login
const items = [
  { label: "Indices", path: "/indices", Component: Indices },
  { label: "Query", path: "/query", Component: Query },
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
      <Container style={{ marginTop: "4em" }}>
        <Switch>
          <Route exact path="/" render={() => <AmcatLogin items={items} />} />
          {createNavigation(items)}
        </Switch>
      </Container>
    </BrowserRouter>
  );
};

export default App;
