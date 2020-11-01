import React, { Fragment } from 'react'
import { useHistory } from 'react-router-dom';
import { HashLink as Link } from 'react-router-hash-link';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'

const Navbar = ({
  siteConfig: { betaMode },
}) => {
  const history = useHistory()

  return (
    <nav id="account-nav">
      <ul className="my-account-nav">
        <Link to="/profile"><li className={history.location.pathname.includes('/profile') ? "active" : ''}><i className="fas fa-user"></i>Profile</li></Link>
        {!betaMode && (
          <Fragment>
            <Link to="/favorites"><li className={history.location.pathname.includes('/favorites') ? "active" : ''}><i className="far fa-heart"></i>Favorites</li></Link>
            <Link to="/cart"><li className={history.location.pathname.includes('/cart') || history.location.pathname.includes('/checkout') ? "active" : ''}><i className="fas fa-shopping-cart"></i>My Cart</li></Link>
            <Link to="/orders"><li className={history.location.pathname.includes('/orders') ? "active" : ''}><i className="fas fa-box"></i>My Orders</li></Link>
          </Fragment>
        )}
      </ul>
      <ul className="my-account-nav">
        <Link to="/change_password"><li className={history.location.pathname.includes('/change_password') ? "active" : ''}><i className="fas fa-lock"></i>Change Password</li></Link>
      </ul>
    </nav>
  )
}

const mapStateToProps = state => ({
  siteConfig: state.siteConfig,
});

export default connect(mapStateToProps)(Navbar);