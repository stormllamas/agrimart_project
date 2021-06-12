import React, { useEffect, Fragment } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom';

import Header from '../layout/Header';

import { connect } from 'react-redux';
import { getArticles, updateQuery, setPage } from '../../actions/pages';

const Home = ({setCurLocation}) => {
  const history = useHistory()

  useEffect(() => {
    const SF = (target) => {
      $(target).scrollfire({
        offset: 150,
        topOffset: 0,
        bottomOffset: 0,
        onBottomIn: function( elm, distance_scrolled ) {
          $(elm).animate({opacity: 1}, 500);
          $(elm).removeClass('fully-visible');
          $(elm).find('.parallax-cell').html('onBottomIn');
        },
      })
    }
    SF('.row-1')
    SF('.row-2')
    SF('.row-3')
    SF('.row-4')
  }, [])

  
  useEffect(() => {
    setCurLocation(history.location)
  }, [history]);

  
  return (
    <Fragment>
      <Header />
      <section className="section section-home grey lighten-3">
        <div className="container pt-4 pb-4">
          <div className="row row-1">
            <div className="col m6 hide-on-small-only">
              <div className="img-content">
                <h4 className="fw-6">Stories & Testimonies</h4>
                Agrimart is supported by a non-profit LGU, Office of the Provincial Agriculturists. Click below to read more about how they've helped local traders.
                <p className="mt-2"><Link to="/testimonies" className="blue-text fs-18">Read articles</Link></p>
              </div>
            </div>
            <div className="col m6">
              <div className="card">
                <div className="card-image">
                  <img src="/static/frontend/img/SS_truck.jpg" alt=""/>
                  <a className="btn-floating halfway-fab waves-effect blue activator hide-on-med-and-up">
                    <i className="material-icons">expand_less</i>
                  </a>
                </div>
                <div className="card-action">
                  <h5 className="mt-1 mb-1 fs-20 hide-on-med-and-up">Stories & Testimonies</h5>
                  <Link to="/testimonies" className="green-text">Read articles</Link>
                </div>
                <div className="card-reveal">
                  <span className="card-title modal-close cancel">
                    <i className="material-icons">close</i>
                  </span>
                  <span className="card-title inline">Stories & Testimonies</span>
                  <p className="mb-1">Agrimart brought to you by a non-profit LGU, Office of the Provincial Agriculturists. Click below to read more about how they've helped local traders.</p>
                  <Link to="/testimonies" className="green-text">Read articles</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="row row-2 fire">
            <div className="col m6">
              <div className="card">
                <div className="card-image">
                  <img src="/static/frontend/img/Shop.jpg" alt=""/>
                  <a className="btn-floating halfway-fab waves-effect blue activator hide-on-med-and-up">
                    <i className="material-icons">expand_less</i>
                  </a>
                </div>
                <div className="card-action">
                  <h5 className="mt-1 mb-1 fs-20 hide-on-med-and-up">Shop</h5>
                  <Link to="/shop" className="green-text">Go to shop</Link>
                </div>
                <div className="card-reveal">
                  <span className="card-title modal-close cancel">
                    <i className="material-icons">close</i>
                  </span>
                  <span className="card-title inline">Shop</span>
                  <p className="mb-2">Browse a selection of Quezon products and shop at your convenience and have them brought to you by our delivery partners. Click below to go to our shop page.</p>
                  <Link to="/shop" className="green-text">Go to shop</Link>
                </div>
              </div>
            </div>
            <div className="col m6 hide-on-small-only">
              <div className="img-content">
                <h4 className="fw-6">Shop</h4>
                Browse a selection of Quezon products and shop at your convenience and have them brought to you by our delivery partners. Click below to go to our shop page.
                <p className="mt-2"><Link to="/shop" className="blue-text fs-18">Go to shop</Link></p>
              </div>
            </div>
          </div>

          <div className="row row-3 fire">
            <div className="col m6 hide-on-small-only">
              <div className="img-content">
                <h4 className="fw-6">Events</h4>
                Checkout our calendared list and keep yourself updated on local programs and events.
                <p className="mt-2"><Link to="/events" className="blue-text fs-18">See upcoming events</Link></p>
              </div>
            </div>
            <div className="col m6">
              <div className="card">
                <div className="card-image">
                  <img src="/static/frontend/img/events.jpg" alt=""/>
                  <a className="btn-floating halfway-fab waves-effect blue activator hide-on-med-and-up">
                    <i className="material-icons">expand_less</i>
                  </a>
                </div>
                <div className="card-action">
                  <h5 className="mt-1 mb-1 fs-20 hide-on-med-and-up">Events</h5>
                  <Link to="/events" className="green-text">See upcoming events</Link>
                </div>
                <div className="card-reveal">
                  <span className="card-title modal-close cancel">
                    <i className="material-icons">close</i>
                  </span>
                  <span className="card-title inline">Events</span>
                  <p className="mb-2">Checkout our calendered list and keep yourself updated on local programs and events.</p>
                  <Link to="/events" className="green-text">See upcoming events</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="row row-4 fire">
            <div className="col m6">
              <div className="card">
                <div className="card-image">
                  <img src="/static/frontend/img/services.jpg" alt=""/>
                  <a className="btn-floating halfway-fab waves-effect blue activator hide-on-med-and-up">
                    <i className="material-icons">expand_less</i>
                  </a>
                </div>
                <div className="card-action">
                  <h5 className="mt-1 mb-1 fs-20 hide-on-med-and-up">Services</h5>
                  <Link to="/services" className="green-text">Checkout out what we do</Link>
                </div>
                <div className="card-reveal">
                  <span className="card-title modal-close cancel">
                    <i className="material-icons">close</i>
                  </span>
                  <span className="card-title inline">Services</span>
                  <p className="mb-2">The provincial agriculturists does a lot more to help our local products. Click below to see what else we do.</p>
                  <Link to="/services" className="green-text">Checkout out what we do</Link>
                </div>
              </div>
            </div>
            <div className="col m6 hide-on-small-only">
              <div className="img-content">
                <h4 className="fw-6">Services</h4>
                The provincial agriculturists does a lot more to help our local products. Click below to see what else we do.
                <p className="mt-2"><Link to="/services" className="blue-text fs-18">Checkout out what we do</Link></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
}

Home.propTypes = {
  getArticles: PropTypes.func.isRequired,
  updateQuery: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  articles: state.articles,
});

export default connect(mapStateToProps, { getArticles, updateQuery, setPage })(Home);
