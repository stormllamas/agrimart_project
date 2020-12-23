import React, { Fragment, useEffect } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'

import { connect } from 'react-redux';
import { logout } from '../../actions/auth';
import { getCurrentOrder } from '../../actions/logistics';


const Topbar = ({
  auth: { isAuthenticated, userLoading, user },
  logistics: { currentOrderLoading, currentOrder },
  logout, getCurrentOrder,
  location
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
      if (isAuthenticated) {
        if (history.location.pathname === '/cart' || history.location.pathname === '/payments') {
        } else {
          getCurrentOrder({})
        }
      }
    }
  }, [userLoading])
  
  return (
    <Fragment>
      <div id="topbar" className="navbar-fixed">
        <nav className="light-green darken-2 white-text">
          <div className="container">
            <div className="nav-wrapper">
              {/* <Link to="/" className="brand-logo"><img src={ !siteInfoLoading ? siteInfo.site_logo : ''} alt="came cart logo" className="responsive-img mr-1"/> <span className="">AGRIMART</span></Link> */}
              <Link to="/" className="brand-logo"><i className="material-icons fs-32">eco</i> <span className="f-style-breeserif">AGRIMART</span></Link>
              <a href="#" data-target="mobile-nav" className="sidenav-trigger show-on-large white-text show-on-small-and-up menu-wrapper relative">
                <i className="material-icons">menu</i>
                {!userLoading && (
                  user && (
                    user.menu_notification && (
                      <div className="menu-notification red rad-5"></div>
                    )
                  )
                )}
              </a>
              {!userLoading && isAuthenticated ? (
                !user.is_staff || user.is_superuser ? (
                  <ul className="right topbar-links relative">
                    <Link to="/cart" className="white-text disabled">
                      <i className="material-icons">shopping_cart</i>
                      {!currentOrderLoading && (
                        currentOrder && (
                          currentOrder.count > 0 && (
                            <i className="material-icons red-text form-notification-btl fs-16">stop_circle</i>
                          )
                        )
                      )}
                    </Link>
                  </ul>
                ): undefined
              ) : (
                <ul className="right topbar-links">
                  <li className={history.location.pathname.includes('login') ? "active" : ''}><Link to="/login" className="white-text text-darken-2">Login</Link></li>
                  <li className={history.location.pathname.includes('signup') ? "active" : ''}><Link to="/signup" className="white-text text-darken-2 hide-on-med-and-down">Signup</Link></li>
                </ul>
              )}
            </div>
          </div>
        </nav>
      </div>
      <ul id="mobile-nav" className="sidenav main-sidenav">
        <li className="light-green-text text-darken-2 flex-row middle center pt-3 pb-3 pr-2">
          <i className="material-icons fs-32">eco</i><span className="f-style-breeserif fs-22">AGRIMART</span>
        </li>
        <li className={history.location.pathname === "/" ? "active" : ""}>
          <Link to="/" className="sidenav-close waves-effect"><i className="material-icons">home</i>Home</Link>
        </li>
        {!userLoading && isAuthenticated ? (
          <Fragment>
            {!user.is_staff || user.is_superuser ? (
              <Fragment>
                <li className={history.location.pathname === '/cart' ? "active" : ''}>
                  <Link to="/cart" className="sidenav-close waves-effect" ><i className="material-icons">shopping_cart</i>My Cart</Link>
                </li>
                <li className={history.location.pathname === '/orders' ? "active" : ''}>
                  <Link to="/orders" className="sidenav-close waves-effect" ><i className="material-icons">assignment</i>My Orders</Link>
                </li>
              </Fragment>
            ) : undefined}
            {user.is_staff && (
              <li>
                <Link to="/order_manager/unprocessed" className="sidenav-close waves-effect" >
                  <i className="material-icons menu-wrapper relative">
                    fact_check
                    {user.menu_notification && (
                      <div className="menu-notification red rad-5"></div>
                    )}
                  </i>
                  Order Manager
                </Link>
              </li>
            )}
            {user.groups.includes('seller') && (
              <li>
                <Link to="/seller_dashboard" className="sidenav-close waves-effect" >
                  <i className="material-icons menu-wrapper relative">
                    fact_check
                    {user.menu_notification && (
                      <div className="menu-notification red rad-5"></div>
                    )}
                  </i>
                  Seller Manager
                </Link>
              </li>
            )}
          </Fragment>
        ) : undefined}
        <li>
          <div className="divider"></div>
        </li>
        <li>
          <a className="subheader">Information</a>
        </li>
        <li className={history.location.pathname === '/services' ? "active" : ''}>
          <Link to="/services" className="sidenav-close waves-effect" ><i className="material-icons">supervised_user_circle</i>Our Other Services</Link>
        </li>
        <li className={history.location.pathname === '/events' ? "active" : ''}>
          <Link to="/events" className="sidenav-close waves-effect" ><i className="material-icons">calendar_today</i>Quezon Events</Link>
        </li>
        {!userLoading && (
          isAuthenticated ? (
            <Fragment>
              <li>
                <div className="divider"></div>
              </li>
              <li>
                <a className="subheader">Account Controls</a>
              </li>
              <li className={history.location.pathname === '/profile' ? "active" : ''}>
                <Link to="/profile" className="sidenav-close waves-effect" ><i className="material-icons">account_circle</i>My Profile</Link>
              </li>
              <li className={history.location.pathname === '/security' ? "active" : ''}>
                <Link to="/security" className="sidenav-close waves-effect" ><i className="material-icons">security</i>Security</Link>
              </li>
              <li>
                <a className="sidenav-close waves-effect" onClick={() => logout()}><i className="material-icons">logout</i>Logout</a>
              </li>
            </Fragment>
          ) : (
            <Fragment>
              <li>
                <div className="divider"></div>
              </li>
              <li>
                <a className="subheader">Account Controls</a>
              </li>
              <li>
                <Link to="/login" className="sidenav-close waves-effect" ><i className="material-icons">login</i>Login</Link>
              </li>
            </Fragment>
          )
        )}
      </ul>
    </Fragment>
  )
}

Topbar.propTypes = {
  logout: PropTypes.func.isRequired,
  getCurrentOrder: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  logistics: state.logistics
});

export default connect(mapStateToProps, { logout, getCurrentOrder })(Topbar);