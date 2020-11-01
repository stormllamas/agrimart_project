import React from 'react';
import PropTypes from 'prop-types'

import { connect } from 'react-redux';
import { hideSiteMessage } from '../../actions/siteConfig'

const SiteMessage = ({
  siteConfig: { siteInfo, showSiteMessage },
  hideSiteMessage,
}) => {

  return (
    <div className={`site-message card p-1 m-0 ${showSiteMessage ? '' : 'read'}`} role="alert">
      <div className="alert-body center middle">
        <button type="button" className="close" onClick={() => hideSiteMessage()} >&times;</button>
        <p className="center">{siteInfo && siteInfo.site_message}</p>
      </div>
    </div>
  )
}

SiteMessage.propTypes = {
  hideSiteMessage: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  siteConfig: state.siteConfig
});

export default connect(mapStateToProps, { hideSiteMessage })(SiteMessage)
