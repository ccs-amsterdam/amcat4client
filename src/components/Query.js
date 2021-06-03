import React from 'react';
import QueryForm from './QueryForm';
import { connect } from 'react-redux';

class Query extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amcatIndexFields: null,
      fieldValues: {},
    };
  }

  render() {
    return <QueryForm />;
  }
}

const mapStateToProps = (state) => {
  return {
    amcat: state.amcat,
    amcatIndex: state.amcatIndex,
  };
};

export default connect(mapStateToProps, {})(Query);
