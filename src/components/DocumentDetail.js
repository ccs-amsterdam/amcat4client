import React from 'react';
import { connect } from 'react-redux';
import { Container, Header, Message } from 'semantic-ui-react';

class DocumentDetail extends React.Component {
  render() {
    if (!this.props.document) return null;
    return (
      <Container>
        <h1>{this.props.document.title}</h1>
        <h2>{this.props.document.date}</h2>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    amcatIndex: state.amcatIndex,
    document: state.document,
  };
};

export default connect(mapStateToProps, {})(DocumentDetail);
