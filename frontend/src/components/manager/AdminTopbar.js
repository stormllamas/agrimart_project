import React, { Fragment, useEffect } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'

import { connect } from 'react-redux';
import { logout } from '../../actions/auth';


const Topbar = ({
  auth: { userLoading, user },
  logout
}) => {
  const history = useHistory()

  useEffect(() => {
    $('.topbar-links').hide()

    $('.collapsible').collapsible({
      accordion: false
    });
  }, [])

  useEffect(() => {
    $('.dropdown-trigger').dropdown();
    if (!userLoading) {
      $('.sidenav').sidenav();
      $('.topbar-links').fadeIn()
    }
  }, [userLoading])
  
  return (
    <ul id="mobile-nav" className="sidenav admin-sidenav">
      <li>
        <div className="user-view flex-col center">
          <div className="green-text flex-row middle pr-3">
            <i className="material-icons fs-42">eco</i> <span className="f-style-breeserif fs-24">AGRIMART</span>
          </div>
          {/* <div className="background white flex-col center middle">
            <img src="/static/frontend/img/camel-cart-banner-1.png" alt="came cart logo" className="responsive-img"/>
          </div> */}
        </div>
      </li>
      <li>
        <Link to="/" className="sidenav-close waves-effect"><i className="material-icons">home</i>Return to Home Page</Link>
      </li>
      {!userLoading && user ? (
        user.is_staff && (
          <Fragment>
            <li className={history.location.pathname === "/order_manager/dashboard" ? "active" : ""}>
              <Link to="/order_manager/dashboard" className="sidenav-close waves-effect"><i className="material-icons">dashboard</i>Dashboard</Link>
            </li>
            <li>
              <div className="divider"></div>
            </li>
            <li>
              <a className="subheader">Order Manager Pages</a>
            </li>
            <li className={history.location.pathname === "/order_manager/unprocessed" ? "active" : ""}>
              <Link to="/order_manager/unprocessed" className="sidenav-close waves-effect" ><i className="material-icons">pending</i>Unprocessed Orders</Link>
            </li>
            <li className={history.location.pathname === "/order_manager/processed" ? "active" : ""}>
              <Link to="/order_manager/processed" className="sidenav-close waves-effect" ><i className="material-icons">pending_actions</i>Processed Orders</Link>
            </li>
            <li className={history.location.pathname === "/order_manager/undelivered" ? "active" : ""}>
              <Link to="/order_manager/undelivered" className="sidenav-close waves-effect" ><i className="material-icons">local_shipping</i>Undelivered Orders</Link>
            </li>
            <li className={history.location.pathname === "/order_manager/delivered" ? "active" : ""}>
              <Link to="/order_manager/delivered" className="sidenav-close waves-effect" ><i className="material-icons">check_box</i>Delivered Orders</Link>
            </li>
          </Fragment>
        )
      ): undefined}
      <li>
        <div className="divider"></div>
      </li>
      <li>
        <a className="subheader">Account Controls</a>
      </li>
      <li>
        <Link to="/profile" className="sidenav-close waves-effect" ><i className="material-icons">account_circle</i>My Profile</Link>
      </li>
      <li>
        <Link to="/security" className="sidenav-close waves-effect" ><i className="material-icons">security</i>Security</Link>
      </li>
      <li className="mb-5">
        <a className="sidenav-close waves-effect" onClick={() => logout()}><i className="material-icons">logout</i>Logout</a>
      </li>
    </ul>
  )
}

Topbar.propTypes = {
  logout: PropTypes.func.isRequired,
  // setFilterToggled: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  // filterOpened: state.products.filterOpened,
  // profileOpened: state.layout.profileOpened,
  // siteConfig: state.siteConfig
});

export default connect(mapStateToProps, { logout })(Topbar);