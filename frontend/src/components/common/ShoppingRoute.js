import React, { useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Preloader from '../layout/Preloader';

import { checkToken, loadUser } from '../../actions/auth'
import { loadApp } from '../../actions/siteConfig';

const ShoppingRoute = ({
  location,
  component: Component,
  auth: { userLoading, isAuthenticated },
  siteConfig: { appLoading, currentVersion, version, maintenanceMode, betaMode },
  ...rest
}) => {
  
  // useEffect(() => {
  //   if (!appLoading) {
  //     if (currentVersion != version) {
  //       window.location.href = window.location.href
  //     }
  //   }
  // }, [appLoading]);

  return (
    <Route
      {...rest}
      render={ props => {
        if (maintenanceMode) {
          return <Redirect to='/site?0' />
        } else if (betaMode) {
          return <Redirect to='/' />
        } else if (appLoading) {
          return <Preloader/>
        } else if (userLoading) {
          return <Component {...props} />
        } else if (!userLoading && !isAuthenticated) {
          return <Redirect to='/login' />
        } else {
          return <Component {...props} />
        }
      }}
    />
  )
}

const mapStateToProps = state => ({
  auth: state.auth,
  siteConfig: state.siteConfig
});

export default connect(mapStateToProps)(ShoppingRoute);