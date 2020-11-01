import React, { Fragment, useEffect } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'

import { connect } from 'react-redux';
import { logout } from '../../actions/auth';


const Topbar = ({
  auth: { isAuthenticated, userLoading, user },
  // siteConfig: { maintenanceMode, betaMode },
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

  const authLinks = (
    <ul className="right hide-on-med-and-down topbar-links">
      <li className="waves-effect"><a className="white-text dropdown-trigger" data-target="partner-dropdown">Be Our Partner<i className="material-icons">keyboard_arrow_down</i></a></li>
      <li className="waves-effect"><a className="white-text">Help Center</a></li>
    </ul>
  )

  const guestLinks = (
    <ul className="right topbar-links">
      <li className={history.location.pathname.includes('login') ? "active" : ''}><Link to="/login" className="grey-text text-darken-2">Login</Link></li>
      <li className={history.location.pathname.includes('signup') ? "active" : ''}><Link to="/signup" className="grey-text text-darken-2 hide-on-med-and-down">Signup</Link></li>
    </ul>
  )
  
  return (
    <Fragment>
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
        <li className={history.location.pathname === "/" ? "active" : ""}>
          <Link to="/" className="sidenav-close waves-effect"><i className="material-icons">home</i>Return to Home Page</Link>
        </li>
        <li className={history.location.pathname === "/admin/dashboard" ? "active" : ""}>
          <Link to="dashboard" className="sidenav-close waves-effect"><i className="material-icons">home</i>Dashboard</Link>
        </li>
        {!userLoading && isAuthenticated ? (
          <Fragment>
            <li>
              <div className="divider"></div>
            </li>
            <li>
              <a className="subheader">Order Manager Pages</a>
            </li>
            <li>
              <Link to="/order_manager/unclaimed" className="sidenav-close waves-effect" ><i className="material-icons">pending</i>Unclaimed Orders</Link>
            </li>
            <li>
              <Link to="/order_manager/claimed" className="sidenav-close waves-effect" ><i className="material-icons">pending_actions</i>Claimed Orders</Link>
            </li>
            <li>
              <Link to="/order_manager/undelivered" className="sidenav-close waves-effect" ><i className="material-icons">local_shipping</i>Undelivered Orders</Link>
            </li>
            <li>
              <Link to="/order_manager/delivered" className="sidenav-close waves-effect" ><i className="material-icons">check_box</i>Delivered Orders</Link>
            </li>
            <li>
              <div className="divider"></div>
            </li>
            <li>
              <a className="subheader">Refund Manager Pages</a>
            </li>
            <li>
              <Link to="#" className="sidenav-close waves-effect" ><i className="material-icons">keyboard_returned</i>Requested Refunds</Link>
            </li>
            <li>
              <Link to="#" className="sidenav-close waves-effect" ><i className="material-icons">assignment_return</i>Approved Refunds</Link>
            </li>
            <li>
              <Link to="#" className="sidenav-close waves-effect" ><i className="material-icons">check_box</i>Resolved Refunds</Link>
            </li>
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
          </Fragment>
        ) : undefined}
      </ul>
    </Fragment>
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