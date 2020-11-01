import React, { useEffect, Fragment } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import AdminTopbar from '../manager/AdminTopbar';

const AdminRoute = ({
  component: Component,
  auth: { userLoading, isAuthenticated, user },
  siteConfig: { siteInfoLoading, siteInfo },
  location,
  ...rest
}) => {
  const history = useHistory()

  useEffect(() => {
    if (!userLoading && !siteInfoLoading) {
      $('.loader').fadeOut();
      $('.middle-content').fadeIn();

    } else {
      $('.loader').show();
      $('.middle-content').hide();
    }
  }, [userLoading, siteInfoLoading])
  
  return (
    <Route
      {...rest}
      render={ props => {
        if (userLoading || siteInfoLoading) {
          return <AdminTopbar/>
        } else {
          if (user) {
            return user.is_staff && isAuthenticated ? (
              <Fragment>
                <AdminTopbar/>
                <div className="middle-wrapper">
                  <div className="middle-content">
                    <Component {...props} />
                  </div>
                </div>
              </Fragment>
            ) : (
              <Redirect to='/' />
            )
          } else {
            return <Redirect to='/' />
          }
        }
      }}
    />
  )
}

AdminRoute.propTypes = {
}

const mapStateToProps = state => ({
  auth: state.auth,
  siteConfig: state.siteConfig,
  logistics: state.logistics
});

export default connect(mapStateToProps)(AdminRoute);