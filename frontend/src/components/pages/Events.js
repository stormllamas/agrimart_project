import React, { useEffect, Fragment } from 'react'
import Moment from 'react-moment';
import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { getEvent } from '../../actions/pages';

const Services = ({
  events: { data, eventLoading },
  getEvent,
  setCurLocation
}) => {
  const history = useHistory()

  useEffect(() => {
    const query = new URLSearchParams(history.location.search);
    const eventQuery = query.get('e')
    getEvent({ eventQuery, history });
  }, []);
  
  useEffect(() => {
    setCurLocation(history.location)
  }, [history]);
  
  useEffect(() => {
    if (!eventLoading) {
      $('.loader').fadeOut();
      $('#middle-content').fadeIn();
      $('.carousel.carousel-slider').carousel({
        fullWidth: true,
        swipeable: true,
        indicators: true,
      });
      $('.scrollspy').scrollSpy();
    } else {
      $('.loader').fadeIn();
      $('#middle-content').fadeOut();
    }
  }, [eventLoading])
  
  return (
    <section className="section section-events">
      <div className="container">
        {!eventLoading && (
          <div className="row">
            <div className="col s12 m12 l8">
              <div className="row">
                <div className="col s12">
                  <div className="card light-green darken-2">
                    <div className="card-image">
                      <img src={data.event.thumbnail}/>
                      {/* <span className="card-title">Image & Button</span> */}
                    </div>
                    <div className="card-content center white-text p-5">
                      <h5 className="card-content center white-text m-0 p-0"><Moment format='MMMM D, YYYY'>{data.event.date}</Moment></h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row hide-on-med-and-up mb-2">
                <div className="col s12 center flex-col">
                  <a href="#event-list" className="fs-18 fw-6 blue-text flex-row middle">See other Events<i className="ml-1 material-icons">keyboard_arrow_down</i></a>
                </div>
              </div>
              <div className="row">
                <div className="col s12">
                  <p className="linebreak">{data.event.summary}</p>
                </div>
              </div>
            </div>
            <div className="col s12 m12 l4">
              <h4 className="uppercase">Events</h4>
              <ul id="event-list" className="event-list grey lighten-3 rad-2 scrollspy">
                {data.events.map(e => (
                  <li key={e.id} className={`event-list-item flex-row waves-effect ${data.event ? e.id === data.event.id && 'active' : ''}`} onClick={() => getEvent({ eventQuery: e.id, history })}>
                    <div className="event-list-icon text-center">
                      <div className="event-list-icon-month text-center">
                        <p className="center m-0"><Moment format='MMM'>{ e.date }</Moment></p>
                      </div>
                      <div className="event-list-icon-day text-center">
                        <p className="center m-0 p-1"><Moment format='D'>{ e.date }</Moment></p>
                      </div>
                    </div>
                    <div className="event-list-text">
                      <p className="fs-18 fw-6 m-0">{ e.title }</p>
                      <p className="lh-4 m-0">{ e.summary.slice(0, 85) }</p>
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
  getEvent: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  events: state.events
});

export default connect(mapStateToProps, { getEvent })(Services);
