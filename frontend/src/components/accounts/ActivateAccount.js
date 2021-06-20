import React, { Fragment, useEffect, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'

import Preloader from '../common/Preloader';

import { connect } from 'react-redux';
import { activate } from '../../actions/auth';

const ActivateAccount = ({
  auth: {isAuthenticated, activatingUser},
  activate,
  match
}) => {

  const [activationSuccess, setActivationSuccess] = useState(false)

  const activateAccount = async () => {
    const uidb64 = match.params.uidb64
    const token = match.params.token
    const res = await activate(uidb64, token)
    console.log(res.data)
    if (res.status === 'okay') {
      setActivationSuccess(true)
    } else {
      setActivationSuccess(false)
    }
  }

  useEffect(() => {
    $('.loader').fadeOut();
    activateAccount()
  }, [])

  return (
    <Fragment>
      <section className="section section-activate-header grey darken-3" style={{ backgroundImage: `url(/static/frontend/img/Agrimart_banner.jpg)`, height: '300px', backgroundSize: 'cover', backgroundPositionY: 'center'}}>
      </section>
      <section className="section section-activate-body grey darken-3" style={{ height: '100vh' }}>
        <div className="container">
          <div className="row mb-0"  style={{ marginTop: '-150px' }}>
            <div className="col s12 m10 offset-m1 l10 offset-l1">
              <div className="card-panel" style={{ minHeight: '318px' }}>
                <div className="center mt-3">
                  <img src="/static/frontend/img/agrimart_logo_green.png" alt="trike logo" style={{ height: '150px' }}/>
                </div>
                {!activatingUser && (
                  activationSuccess === true ? (
                    <Fragment>
                      <h4 className="center mb-5">Account Activated!</h4>
                      <div className="row mt-2">
                        <div className="col s12 m6 center mb-3">
                          <a href="agrimart://login" className="btn btn-large blue">Go to App<i className="fas fa-external-link-alt ml-1 fs-15"></i></a>
                        </div>
                        <div className="col s12 m6 center">
                          <a href="/" className="btn btn-large white grey-text text-darken-2">Go to Site<i className="fas fa-external-link-alt ml-1 fs-15"></i></a>
                        </div>
                      </div>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <h4 className="center mb-5">Activation Failed</h4>
                      <div className="row">
                        <div className="col s12 m8 offset-m2">
                          <p className="fs-18 center">This link might have already expired or, your account may already have been activated.</p>
                          <p className="fs-18 center">You can try:</p>
                          <ul className="center mb-5">
                            <li><i className="far fa-arrow-alt-circle-right"></i> Signing Up again</li>
                            <li><i className="far fa-arrow-alt-circle-right"></i> loging in</li>
                          </ul>
                          <div className="row mt-2">
                            <div className="col s12 m6 center mb-3">
                              <a href="agrimart://login" className="btn btn-large blue">Go to App<i className="fas fa-external-link-alt ml-1 fs-15"></i></a>
                            </div>
                            <div className="col s12 m6 center">
                              <a href="/" className="btn btn-large white grey-text text-darken-2">Go to Site<i className="fas fa-external-link-alt ml-1 fs-15"></i></a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
}

ActivateAccount.propTypes = {
  activate: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { activate })(ActivateAccount);