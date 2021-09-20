import React from 'react';
import { connect } from 'react-redux';
import { Container, Header, Message } from 'semantic-ui-react';

class AmcatIndexDetails extends React.Component {
  render() {
    if (!this.props.amcatIndex) return null;
    return (
      <Container>
        <>
          <Header textAlign="left">{this.props.amcatIndex.name}</Header>
          <Message
            content={`You are seeing this project from the host: ${this.props.amcat.host} as the user: ${this.props.amcat.email}`}
          />
        </>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    amcat: state.amcat,
    amcatIndex: state.amcatIndex,
  };
};

export default connect(mapStateToProps, {})(AmcatIndexDetails);
