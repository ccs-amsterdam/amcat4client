import React from 'react';
import { connect } from 'react-redux';
import { Container, Header, Message } from 'semantic-ui-react';

class AmcatIndexDetails extends React.Component {
  render() {
    if (!this.props.amcatIndex) return null;
    return (
      <Container>
        <>
          <Header textAlign="center">{this.props.amcatIndex.name}</Header>
          <Message
            header="I am an Project"
            content="And here should be some stuff that you can do with an index"
          />
        </>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    amcatIndex: state.amcatIndex,
  };
};

export default connect(mapStateToProps, {})(AmcatIndexDetails);
