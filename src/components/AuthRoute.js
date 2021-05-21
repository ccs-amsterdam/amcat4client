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

// const AuthRoute = ({ Component, ...componentProps }) => {
//   // the trick for passing on componentProps is basically
//   // redundant now that we use Redux, but leaving it intact just in case
//   const amcat = useSelector((state) => state.amcat);
//   if (!amcat) return <Redirect to="/" />;
//   return (
//     <Route
//       {...componentProps}
//       render={(props) => <Component {...componentProps} {...props} />}
//     />
//   );
// };

const mapStateToProps = (state, ownProps) => {
  return {
    amcat: state.amcat,
    ownProps: ownProps,
  };
};

export default connect(mapStateToProps, {})(AuthRoute);
