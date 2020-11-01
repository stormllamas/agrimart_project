import React, { Fragment } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import PropTypes from 'prop-types'

import { connect } from 'react-redux';

const Footer = ({
  siteConfig: { siteInfo }
}) => {

  return (
    <Fragment>
      <footer className="page-footer light-green darken-2">
        <div className="container">
          <div className="row flex">
            <div className="col s12 m6 l3">
              <h5 className="grey-text text-lighten-3 uppercase center">An entity by</h5>
              <div className="row">
                <div className="col s6">
                  <img className="responsive-img" src={ siteInfo.header_logo_1 ? siteInfo.header_logo_1 : '' } style={{ maxHeight: '80px' }}/>
                </div>
                <div className="col s6">
                  <img className="responsive-img" src={ siteInfo.site_logo ? siteInfo.site_logo : '' } style={{ maxHeight: '80px' }}/>
                </div>
              </div>
            </div>
            <div className="col s12 m4 l3">
              <h5 className="grey-text text-lighten-3">Our Services</h5>
              <ul>
                <li>
                  <Link to="" className="white-text">Tracking</Link>
                </li>
                <li>
                  <Link to="" className="white-text">Shipping</Link>
                </li>
                <li>
                  <Link to="" className="white-text">Locations</Link>
                </li>
                <li>
                  <Link to="" className="white-text">My Profile</Link>
    
                </li>
              </ul>
            </div>
            <div className="col s12 m6 l3">
              <h5 className="grey-text text-lighten-3">Information</h5>
              <ul>
                <li>
                  <Link to="" className="white-text">About Camel Cart</Link>
                </li>
              </ul>
            </div>
            <div className="col s12 m4 l3">
              <h5 className="grey-text text-lighten-3">Connect with Us</h5>
              <ul>
                <li>
                  <Link to="" className="white-text">Facebook</Link>
                </li>
                <li>
                  <Link to="" className="white-text">Instagram</Link>
                </li>
                <li>
                  <Link to="" className="white-text">Twitter</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="row flex-col center middle">
            <div className="col">
              <img className="responsive-img" src="/static/frontend/img/TechLlama_powered-transparent.png" style={{ height: '40px' }}/>
            </div>
          </div>
        </div>
        <div className="footer-copyright light-green darken-4">
          <div className="container center">
            Copyright &copy; 2020
            <Link to="#" className="grey-text text-lighten-3 right">Terms & Conditions</Link>
            <Link to="#" className="grey-text text-lighten-3 left">Privacy Policy</Link>
          </div>
        </div>
      </footer>
      {/* <footer id="main-footer">
        <div className="container">
          <div className="content row">
            <div className="col-1 col center middle">
              <div className="footer-logo"
                style={{
                  backgroundImage: `${ siteInfo.header_logo_2 ? `url('${siteInfo.header_logo_2}')` : '' }`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center center',
                  backgroundSize: 'contain',
                }}
              >
              </div>
            </div>
            <div className="col-2">
              <h3>Contact</h3>
              <div className="phone"><i className="fas fa-phone"></i><p>{ siteInfo.phone }</p></div>
              <div className="email"><i className="fas fa-envelope"></i><p>{ siteInfo.email }</p></div>
              <div className="address"><i className="fas fa-map-marker-alt"></i><p>{ siteInfo.location }</p></div>
            </div>
            <div className="col-3">
              <h3>Office Hours</h3>
              <div>
                { siteInfo.office_hours }
              </div>
              <div><p>Jop Openings</p></div>
              <div><p>Business</p></div>
            </div>
            <div className="col-4 col center middle">
              <div className="send-message-button">
                <Link to="/contact" className="btn-green">Send us a message</Link>
              </div>
              <div className="social-media">
                <a href="#"><i className="fab fa-facebook"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-youtube"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
              </div>
            </div>
          </div>
        </div>
      </footer> */}
    </Fragment>
  )
}

const mapStateToProps = state => ({
  siteConfig: state.siteConfig,
});

export default connect(mapStateToProps)(Footer);