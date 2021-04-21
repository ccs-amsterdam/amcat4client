import React from "react";
import { useSelector } from "react-redux";
import { Container, Header, Message } from "semantic-ui-react";

const AmcatIndexDetails = ({}) => {
  //const amcat = useSelector((state) => state.amcat);
  const amcatIndex = useSelector((state) => state.amcatIndex);

  if (!amcatIndex) return null;
  return (
    <Container>
      <>
        <Header textAlign="center">{amcatIndex.name}</Header>
        <Message
          header="I am an index"
          content="And here should be some stuff that you can do with an index"
        />
      </>
    </Container>
  );
};

export default AmcatIndexDetails;
