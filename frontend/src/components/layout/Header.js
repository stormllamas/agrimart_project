import React, { useEffect } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import PropTypes from 'prop-types'

import { connect } from 'react-redux';

const Header = ({
  auth: { isAuthenticated },
  siteConfig: { siteInfo }
}) => {

  return (
    <header className="section main-header relative bg-cover"
      style={{
        backgroundImage: `${ siteInfo.main_header_image ? `url('${siteInfo.main_header_image}')` : '' }`,
        // backgroundRepeat: 'no-repeat',
        // backgroundPosition: 'center center',
        // backgroundSize: 'cover',
        // backgroundAttachment: 'fixed'
      }}>
      
      <div className="primary-overlay valign-wrapper">
        <div className="row full-width">
          <div className="col s12 m8 offset-m2 center">
            <h4 className="m-0 uppercase f-style-breeserif lh-8">{ siteInfo.site_sub_title }</h4>
            <h2 className="m-0 uppercase f-style-breeserif lh-8">{ siteInfo.site_title }</h2>
            <p className="fs-16 mt-3">{ siteInfo.header_text }</p>
            <div className="header-image-1 hide-on-small-only"
              style={{
                backgroundImage: `${ siteInfo.header_logo_1 ? `url('${siteInfo.header_logo_1}')` : '' }`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left center',
                backgroundSize: 'contain',
              }}
            >
            </div>
            <div className="header-image-2 hide-on-small-only"
              style={{
                backgroundImage: `${ siteInfo.header_logo_2 ? `url('${siteInfo.header_logo_2}')` : '' }`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left center',
                backgroundSize: 'contain',
              }}
            >
            </div>
            <Link to="/shop" className="btn btn-large white green-text text-darken-2 waves-effect mt-3 mr-2">SHOP NOW</Link>
            {!isAuthenticated && (
              <Link to="/login" className="btn btn-large light-green  darken-2 white-text waves-effect mt-3">Login</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

const mapStateToProps = state => ({
  auth: state.auth,
  siteConfig: state.siteConfig,
});

export default connect(mapStateToProps)(Header);

