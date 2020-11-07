import React, { Fragment, useEffect, useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'

import { connect } from 'react-redux';
import { verifyPasswordReset, resetPassword } from '../../../actions/auth';

const PasswordResetForm = ({
  match,
  auth: { passwordResetVerifying, passwordResetValid, user },
  verifyPasswordReset, resetPassword, checkPasswordMatch
}) => {
  const history = useHistory()
  const uidb64 = match.params.uidb64
  const token = match.params.token

  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword2, setNewPassword2] = useState('');

  useEffect(() => {
    verifyPasswordReset(uidb64, token)
  }, []);

  const onSubmit = async e => {
    e.preventDefault();
    await resetPassword(uidb64, token, newPassword1, history)
  }

  return (
    !passwordResetVerifying && (
      <section id="password-reset-form" className="section section-password-reset-form">
        <div className="container">
          <div className="row mb-0">
            <div className="col s12 m8 offset-m2 l6 offset-l3">
              {passwordResetValid ? (
                <div className="card-panel mt-5 center">
                  <h5>Change password for</h5>
                  <p className="grey-text fs-18 fw-6">@{user ? user.email : ''}</p>
                  <form method="post" className="block" noValidate onSubmit={onSubmit}>
                    <div className="input-field">
                      <label htmlFor="id_new_password1">New password</label>
                      <input type="password" name="new_password1" autoFocus value={newPassword1} className="form-control" id="id_new_password1" onChange={e => setNewPassword1(e.target.value)} required/>
                    </div>
                    <div className="input-field">
                      <label htmlFor="id_new_password2">New password confirmation</label>
                      <input type="password" name="new_password2" value={newPassword2} className="form-control " id="id_new_password2" onChange={e => setNewPassword2(e.target.value)} required/>
                    </div>
                    <button type="submit" className="btn btn-large btn-extended blue">Change password</button>
                  </form>
                </div>
              ) : (
                <div className="card-panel mt-5">
                  <h3 className="card-title">Reset your password</h3>
                  <p className="text-center">It looks like you clicked on an invalid password reset link. Please try again.</p>
                  <a href="{% url 'password_reset' %}" className="btn-blue text-center">Request a new password reset link</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  )
}

PasswordResetForm.propTypes = {
  verifyPasswordReset: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { verifyPasswordReset, resetPassword })(PasswordResetForm);