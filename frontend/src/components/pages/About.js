import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types'

import Preloader from '../layout/Preloader';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

import { connect } from 'react-redux';

const About = ({ siteConfig: { siteConfigLoading, siteInfo }, history }) => {

  useEffect(() => {
    // getSiteConfig();
  // eslint-disable-next-line
  }, [history.location.key]); // This retriggers if same link is clicked

  return (
    <Fragment>
      {siteConfigLoading && <Preloader />}
      <Header />
      <section id="about-page" className="page col">
        <div className="container full-height">
          {!siteConfigLoading && (
            <Fragment>
              <div className="row-1">
                <div className="card-title col center">
                  <h3 className="mt-5 mb-0">About Us</h3>
                  <hr/>
                </div>
              </div>
              <div className="row-2 mb-5">
                <div className="linebreak p-5">
                  <h5 className="mt-0">{ siteInfo.about_sub_header ? siteInfo.about_sub_header : 'Insert Subheader Here' }</h5>
                  <p className="fs-14">{ siteInfo.about_text ? siteInfo.about_text : 'Insert About Text Here' }</p>
                </div>
              </div>
            </Fragment>
          )}
        </div>
      </section>
    </Fragment>
  )
}

About.propTypes = {
  history: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  siteConfig: state.siteConfig
});

export default connect(mapStateToProps)(About);
