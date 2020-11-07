import React, { Fragment, useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import { requestPasswordReset } from '../../../actions/auth';

const PasswordReset = ({
  auth: { requestLoading, userLoading },
  requestPasswordReset, match
}) => {

  const [email, setEmail] = useState('');
  const [requestEmail, setRequestEmail] = useState('');

  const onSubmit = async e => {
    e.preventDefault();
    if (email) {
      const request = await requestPasswordReset(email)
      if (request === 'okay') {
        setRequestEmail(email)
      }
    } else {
      M.toast({
        html: 'Please enter an email',
        displayLength: 3500,
        classes: 'red',
      });
    }
  }

  return (
    !userLoading && (
      <div className="section section-password-reset">
        <div className="container">
          <div className="row mb-0">
            <div className="col s12 m8 offset-m2 l6 offset-l3">
              {requestEmail === '' ? (
                <div className="card-panel mt-5">
                  <h4 className="card-title">Reset your password</h4>
                  <p>Enter your email address below and we'll send you a link to reset your password.</p>
                  <form method="post" className="block" onSubmit={onSubmit} noValidate>
                    <div className="input-field">
                      <label htmlFor="email">Email</label>
                      <input type="email" name="email" value={email} autoFocus maxLength="254" className="form-control" required id="id_email" onChange={e => setEmail(e.target.value)} required/>
                    </div>
                    <button type="submit" className="btn btn-extended green">Send password reset email</button>
                  </form>
                </div>
              ) : (
                <div className="card-panel mt-5 center">
                  <h4 className="card-title">Reset your password</h4>
                  <p className="">Please check your email at</p>
                  <p className="text-grey fw-6 fs-18">{email}</p>
                  <p className="">for a link to reset your password. If it doesn't appear within a few minutes, please check your spam folder.</p>
                  <Link to="/login" className="btn btn-large btn-extended blue">Return to log in</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  )
}

PasswordReset.propTypes = {
  requestPasswordReset: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { requestPasswordReset })(PasswordReset);