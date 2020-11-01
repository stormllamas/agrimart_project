import React, { Fragment, useEffect, useState } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'

import Preloader from '../../layout/Preloader';

import { connect } from 'react-redux';
import { verifyPasswordReset, resetPassword } from '../../../actions/auth';

const PasswordResetForm = ({
  match,
  auth: { passwordResetVerifying, passwordResetValid, isAuthenticated, userLoading, user },
  verifyPasswordReset, resetPassword, validateField, checkPasswordMatch, validateForm
}) => {
  const history = useHistory()
  const uidb64 = match.params.uidb64
  const token = match.params.token

  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword2, setNewPassword2] = useState('');

  useEffect(() => {
    verifyPasswordReset(uidb64, token)
  // eslint-disable-next-line
  }, [history.location.key]);

  const onSubmit = async e => {
    e.preventDefault();
    const formValidation = {}
    formValidation[validateField(document.getElementById('id_new_password1'), ['required'])] = true
    formValidation[validateField(document.getElementById('id_new_password2'), ['required'])] = true
    formValidation[checkPasswordMatch(document.getElementById('id_new_password1'), document.getElementById('id_new_password2'))] = true

    const validForm = validateForm(formValidation)
    validForm && await resetPassword(uidb64, token, newPassword1, history)
  }

  if (!userLoading&&isAuthenticated) {return ( <Redirect to='/' /> )}
  return (
    <Fragment>
      {passwordResetVerifying ? <Preloader /> : undefined}
      {!passwordResetVerifying && (
        <section id="password-reset-form" className="auth row center middle">
          <div className="pass-reset card">
            <div className="card-body col center">
              {passwordResetValid ? (
                <Fragment>
                  <h1 className="card-title">Change password for <span className="text-mute">@{user ? user.username : ''}</span></h1> 
                  <form method="post" className="col center" noValidate onSubmit={onSubmit}>
                    <div className="form-group">
                      <label htmlFor="id_new_password1">New password</label>
                      <input type="password" name="new_password1" autoFocus value={newPassword1} className="form-control" id="id_new_password1" onChange={e => setNewPassword1(e.target.value)} onBlur={() => checkPasswordMatch(document.getElementById('id_new_password1'), document.getElementById('id_new_password2'))} required/>
                    </div>
                    <div className="form-group">
                      <label htmlFor="id_new_password2">New password confirmation</label>
                      <input type="password" name="new_password2" value={newPassword2} className="form-control " id="id_new_password2" onChange={e => setNewPassword2(e.target.value)} onBlur={() => checkPasswordMatch(document.getElementById('id_new_password1'), document.getElementById('id_new_password2'))} required/>
                      <small className="form-text text-muted">
                        <ul>
                          <li>Password must match</li>
                        </ul>
                      </small>
                    </div>
                    <button type="submit" className="btn-blue btn-large">Change password</button>
                  </form>
                </Fragment>
              ) : (
                <Fragment>
                  <h3 className="card-title">Reset your password</h3>
                  <p className="text-center">It looks like you clicked on an invalid password reset link. Please try again.</p>
                  <a href="{% url 'password_reset' %}" className="btn-blue text-center">Request a new password reset link</a>
                </Fragment>
              )}
            </div>
          </div>
        </section>
      )}
    </Fragment>
  )
}

PasswordResetForm.propTypes = {
  verifyPasswordReset: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {verifyPasswordReset, resetPassword })(PasswordResetForm);