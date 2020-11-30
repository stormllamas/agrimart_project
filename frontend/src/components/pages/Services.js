import React, { useEffect, Fragment } from 'react'
import Moment from 'react-moment';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'

import Header from '../layout/Header';
import Footer from '../layout/Footer';

import { connect } from 'react-redux';
import { getService } from '../../actions/pages';

const Services = ({
  services: { data, serviceLoading },
  getService,
  setCurLocation
}) => {
  const history = useHistory()

  useEffect(() => {
    const query = new URLSearchParams(history.location.search);
    const serviceQuery = query.get('s')
    getService({ serviceQuery, history });
  }, []);
  
  useEffect(() => {
    setCurLocation(history.location)
  }, [history]);
  
  useEffect(() => {
    if (!serviceLoading) {
      $('.loader').fadeOut();
      $('#middle-content').fadeIn();
      $('.carousel.carousel-slider').carousel({
        fullWidth: true,
        swipeable: true,
        indicators: true,
      });
    } else {
      $('.loader').fadeIn();
      $('#middle-content').fadeOut();
    }
  }, [serviceLoading])
  
  return (
    <section className="section section-services">
      <div className="container">
        {!serviceLoading && (
          <div className="row">
            <div className="col s12 m12 l8">
              <div className="row">
                <div className="col s12">
                  <div className="carousel carousel-slider center">
                    <ul className="slides">
                      {data.service.photo_1 && (
                        <a className="carousel-item grey">
                          <div className="full-width full-height bg-cover" style={{ backgroundImage: `url(${data.service.photo_1})` }}></div>
                        </a>
                      )}
                      {data.service.photo_2 && (
                        <a className="carousel-item grey">
                          <div className="full-width full-height bg-cover" style={{ backgroundImage: `url(${data.service.photo_2})` }}></div>
                        </a>
                      )}
                      {data.service.photo_3 && (
                        <a className="carousel-item grey">
                          <div className="full-width full-height bg-cover" style={{ backgroundImage: `url(${data.service.photo_3})` }}></div>
                        </a>
                      )}
                      {data.service.photo_4 && (
                        <a className="carousel-item grey">
                          <div className="full-width full-height bg-cover" style={{ backgroundImage: `url(${data.service.photo_4})` }}></div>
                        </a>
                      )}
                      {data.service.photo_5 && (
                        <a className="carousel-item grey">
                          <div className="full-width full-height bg-cover" style={{ backgroundImage: `url(${data.service.photo_5})` }}></div>
                        </a>
                      )}
                      {data.service.photo_6 && (
                        <a className="carousel-item grey">
                          <div className="full-width full-height bg-cover" style={{ backgroundImage: `url(${data.service.photo_6})` }}></div>
                        </a>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col s12">
                  <p className="linebreak">{data.service.summary}</p>
                </div>
              </div>
            </div>
            <div className="col s12 m12 l4">
              <h4>Other Services</h4>
              <ul>
                {data.services.map(s => (
                  <li key={s.id} className={`card full-width waves-effect ${data.service.id === s.id ? 'orange lighten-1 white-text' : ''}`} onClick={() => getService({ serviceQuery: s.id, history })}>
                    <div className="card-content">
                    <p className="flex-row middle fs-18">
                      <i className="material-icons fs-42 mr-2">{s.icon}</i>
                      {s.title}
                    </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

Services.propTypes = {
  getService: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  services: state.services
});

export default connect(mapStateToProps, { getService })(Services);
