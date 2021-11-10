import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import AuthHelper from '../services/AuthHelper';

const PrivateRoute = ({ component: Component, ...rest }) => {
 
  const isLoggedIn = AuthHelper.isUserLoggedIn();

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

export default PrivateRoute