import React, { useState } from "react";
import {
  Grid,
  Menu,
  Segment,
  Button,
  Table,
  Container,
  Header,
} from "semantic-ui-react";

import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import CreateDocument from "./CreateDocument";
import AmcatIndexDetails from "./AmcatIndexDetails";
import DeleteAmcatIndex from "./DeleteAmcatIndex";
import AmcatIndexSelector from "./AmcatIndexSelector";
import UploadDocuments from "./UploadDocuments";

const Indices = () => {
  const [activeItem, setActiveItem] = useState("details");
  const amcatIndex = useSelector((state) => state.amcatIndex);
  const history = useHistory();

  const renderSwitch = (activeItem) => {
    switch (activeItem) {
      case "details":
        return <AmcatIndexDetails />;
      case "upload":
        return <UploadDocuments />;
      case "create":
        return <CreateDocument />;
      default:
        return null;
    }
  };

  return (
    <Grid stackable style={{ marginTop: "3em" }}>
      <Grid.Column floated="left" width={5}>
        <AmcatIndexSelector />
      </Grid.Column>
      <Grid.Column width={11}>
        <Button.Group widths="2">
          <Button
            primary
            disabled={!amcatIndex}
            onClick={(e, d) => history.push("/query")}
          >
            Query
          </Button>
          <DeleteAmcatIndex amcatIndex={amcatIndex} />
        </Button.Group>
        <Segment style={{ border: 0 }}>
          <Menu pointing secondary>
            <Menu.Item
              name="details"
              active={activeItem === "details"}
              onClick={(e, d) => setActiveItem(d.name)}
            />
            <Menu.Item
              name="upload"
              active={activeItem === "upload"}
              onClick={(e, d) => setActiveItem(d.name)}
            />
            <Menu.Item
              name="create"
              active={activeItem === "create"}
              onClick={(e, d) => setActiveItem(d.name)}
            />
          </Menu>
          {renderSwitch(activeItem)}
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default Indices;
