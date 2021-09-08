import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import history from '../history';

import { selectDocument } from '../actions';

import {
  Container,
  Header,
  Label,
  Grid,
  Message,
  Icon,
  Button,
} from 'semantic-ui-react';

const DocumentDetail = () => {
  const amcat = useSelector((state) => state.amcat);
  const amcatIndex = useSelector((state) => state.amcatIndex);
  const document = useSelector((state) => state.document);

  const dispatch = useDispatch();

  useEffect(() => {
    if (amcat && amcatIndex && document.ORG_ID) {
      amcat.getDocument(amcatIndex.name, document.ORG_ID).then((res) => {
        dispatch(selectDocument(res.data));
      });
    }
  }, [amcat, amcatIndex, dispatch, document.ORG_ID]);

  if (Object.keys(document).length === 0) {
    return (
      <Container>
        <>
          <Header textAlign="center">No Documents Selected!</Header>
          <Message icon>
            <Icon name="circle notched" loading />
            <Message.Content>
              <Message.Header>Waiting for document</Message.Header>
              <Button onClick={() => history.push('/query')}>
                Select a document
              </Button>
            </Message.Content>
          </Message>
        </>
      </Container>
    );
  } else {
    return (
      <Grid divided>
        <Grid.Row columns={2}>
          <Grid.Column floated="right" width={7}>
            <Header as="h1">
              <Label as="a" color="blue" ribbon>
                Document Title
              </Label>
              {document.title}
            </Header>
          </Grid.Column>
          <Grid.Column floated="right" width={7}>
            <Header as="h2">
              <Label as="a" color="blue" ribbon>
                Document Date
              </Label>
              {document.date}
            </Header>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={1}>
          <Grid.Column floated="left" width={16}>
            <Container textAlign="justified">
              <div className="ui segment">
                <p>{document.text}</p>
              </div>
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
};

export default DocumentDetail;
