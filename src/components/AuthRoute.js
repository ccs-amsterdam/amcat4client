import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router';

class AuthRoute extends React.Component {
  render() {
    if (!this.props.amcat) return <Redirect to="/" />;
    return (
      <Route
        {...this.props.ownProps.componentProps}
        render={(props) => (
          <this.props.ownProps.Component
            {...this.props.ownProps.componentProps}
            {...props}
          />
        )}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    amcat: state.amcat,
    ownProps: ownProps,
  };
};

export default connect(mapStateToProps, {})(AuthRoute);
