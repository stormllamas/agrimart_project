import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';


const Page404 = ({
  siteConfig: { siteInfoLoading, siteInfo }
}) => {

  useEffect(() => {
    if (!siteInfoLoading) {
      $('.loader').fadeOut();
      $('#middle-content').fadeIn();
    } else {
      $('.loader').fadeIn();
      $('#middle-content').fadeOut();
    }
  }, [siteInfoLoading])

  return (
    <div className="middle-wrapper flex-col middle">
      <div className="middle-content flex-col middle">
        <section className="section section-page404">
          <div className="flex-col center">
            {!siteInfoLoading && (
              siteInfo.maintenance_mode ? (
                <img className="responsive-img" src="/static/frontend/img/under-construction.png" alt="Under Construction" style={{ height: "500px" }}></img>
              ) : (
                <Fragment>
                  <img className="responsive-img" src="/static/frontend/img/error_bunny.png" alt="Error Bunny" style={{ height: "175px" }}></img>
                  <h4 className="mt-4 mb-0">Uh oh.</h4>
                  <h3 className="mt-0">Page not found</h3>
                  <p className="m-0">The page you requested could not be found.</p>
                  <p className="m-0">Is there any chance you typed the wrong URL?</p>
                </Fragment>
              )
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

Page404.propTypes = {
  history: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  siteConfig: state.siteConfig
});

export default connect(mapStateToProps)(Page404);
