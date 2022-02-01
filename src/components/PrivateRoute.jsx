
import React from 'react';
import { Redirect, Route } from 'react-router-dom'
import { useSelector } from 'react-redux';

const PrivateRoute = ({ component: Component, ...rest }) => {

  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn ? (
             <Component {...props} />
        ) : (
          <Redirect to="/auth" />
        )
      }
    />
  )
}
 
export default PrivateRoute;