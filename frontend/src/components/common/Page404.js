import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import Preloader from '../layout/Preloader';


const Page404 = ({
  siteConfig: { siteConfigLoading, data }
}) => {

  return (
    <Fragment>
      {siteConfigLoading && <Preloader />}
      <section id="error-page">
        <div className="container row middle center">
          {!siteConfigLoading && (
            <Fragment>
              <div className="error-handler-content text-center">
                {data.maintenance_mode ? (
                  <Fragment>
                    <h1>Site Under Construction</h1>
                    <h2>Hey There!</h2>
                    <p>It appears our page is under maintenance</p>
                    <p className="mb">Please try again at a later time. Thank you!</p>
                  </Fragment>
                ) : (
                  <Fragment>
                    <h1>Page not found</h1>
                    <h2>Uh oh.</h2>
                    <p>The page you requested could not be found.</p>
                    <p className="mb">Is there any chance you typed the wrong URL?</p>
                  </Fragment>
                )}
              </div>
              <div className="error-image col center middle">
                {data.maintenance_mode ? (
                  <img id="under-construction" src="static/frontend/img/under-construction.png" alt="Under Construction"></img>
                ) : (
                  <img id="error-bunny" src="static/frontend/img/error_bunny.png" alt="Error Bunny"></img>
                )}
              </div>
            </Fragment>
          )}
        </div>
      </section>
    </Fragment>
  )
}

Page404.propTypes = {
  history: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  siteConfig: state.siteConfig
});

export default connect(mapStateToProps)(Page404);
