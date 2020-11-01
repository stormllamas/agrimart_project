import React, { Fragment, useEffect, useState, useRef } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'

import Preloader from '../layout/Preloader';
import AccountNav from '../layout/AccountNav';

import { connect } from 'react-redux';
import { updatePassword } from '../../actions/auth';

const ChangePassword = ({
  auth: { isAuthenticated, userLoading },
  updatePassword, validateForm, validateField, checkPasswordMatch
}) => {
  const history = useHistory()

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword2, setNewPassword2] = useState('');

  const onSubmit = async e => {
    e.preventDefault();
    const formValidation = {}
    formValidation[validateField(document.getElementById('id_old_password'), ['required'])] = true
    formValidation[validateField(document.getElementById('id_new_password1'), ['required'])] = true
    formValidation[validateField(document.getElementById('id_new_password2'), ['required'])] = true
    formValidation[checkPasswordMatch(document.getElementById('id_new_password1'), document.getElementById('id_new_password2'))] = true

    const validForm = validateForm(formValidation)
    if (validForm) {
      const changePass = await updatePassword(oldPassword, newPassword1)
      if (changePass === 'okay') {
        setOldPassword('')
        setNewPassword1('')
        setNewPassword2('')
      }
    }
  }

  if (!userLoading&&!isAuthenticated) {
    return ( <Redirect to='/' /> )
  }

  return (
    <Fragment>
      {userLoading ? <Preloader /> : undefined}
      <div className="account container row">
        <AccountNav />
        <section id="password-change" className="account-content">
          <ul className="breadcrumb row">
            <li className="breadcrumb-item"><h1>Change Your Password</h1></li>
          </ul>
          <div className="account-body half col">
            <Fragment>
              <form id="change-password" noValidate onSubmit={onSubmit}>
                <div className="form-group">
                  <label htmlFor="id_old_password">Old password</label>
                  <input type="password" name="old_password" autoComplete="current-password" autoFocus="" value={oldPassword} className="form-control" required="" id="id_old_password" onChange={e => setOldPassword(e.target.value)} onBlur={e => validateField(e.target, ['required'])} required/>
                </div>
                <div className="form-group">
                  <label htmlFor="id_new_password1">New password</label>
                  <input type="password" name="new_password1" autoComplete="new-password" value={newPassword1} className="form-control " required="" id="id_new_password1" onChange={e => setNewPassword1(e.target.value)} onBlur={() => checkPasswordMatch(document.getElementById('id_new_password1'), document.getElementById('id_new_password2'))} required/>
                </div>
                <div className="form-group">
                  <label htmlFor="id_new_password2">New password confirmation</label>
                  <input type="password" name="new_password2" autoComplete="new-password" value={newPassword2} className="form-control " required="" id="id_new_password2" onChange={e => setNewPassword2(e.target.value)} onBlur={() => checkPasswordMatch(document.getElementById('id_new_password1'), document.getElementById('id_new_password2'))} required/>
                  <small className="form-text text-muted">
                    <ul>
                      {/* <li>Your password can’t be too similar to your other personal information.</li>
                      <li>Your password must contain at least 8 characters.</li>
                      <li>Your password can’t be a commonly used password.</li>
                      <li>Your password can’t be entirely numeric.</li> */}
                      <li>Password must match</li>
                    </ul>
                  </small>
                </div>
                <button type="submit" className="btn-success btn-wide btn-large">Save Changes</button>
              </form>
            </Fragment>
          </div>
        </section>
      </div>
    </Fragment>
  )
}

ChangePassword.propTypes = {
  updatePassword: PropTypes.func.isRequired,
  checkPasswordMatch: PropTypes.func.isRequired,
  validateField: PropTypes.func.isRequired,
  validateForm: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { updatePassword })(ChangePassword);