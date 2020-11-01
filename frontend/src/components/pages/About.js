import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types'

import Preloader from '../layout/Preloader';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

import { connect } from 'react-redux';

const About = ({ siteConfig: { siteConfigLoading, data }, history }) => {

  useEffect(() => {
    getSiteConfig();
  // eslint-disable-next-line
  }, [history.location.key]); // This retriggers if same link is clicked

  return (
    <Fragment>
      {siteConfigLoading && <Preloader />}
      <Header />
      <section id="about-page" className="page col center">
        <div className="card container-short full-height">
          {!siteConfigLoading && (
            <Fragment>
              <div className="row-1">
                <div className="card-title col center middle">
                  <h2>About Us</h2>
                  <hr/>
                </div>
              </div>
              <div className="row-2">
                <div className="about-text">
                  <h3>{ data.about_sub_header ? data.about_sub_header : 'Insert Subheader Here' }</h3>
                  <p>{ data.about_text ? data.about_text : 'Insert About Text Here' }</p>
                </div>
              </div>
            </Fragment>
          )}
        </div>
      </section>
      <Footer/>
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
