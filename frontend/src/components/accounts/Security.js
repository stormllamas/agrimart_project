import React, { Fragment, useEffect, useState } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import { updatePassword } from '../../actions/auth'

const Security = ({
  auth: { isAuthenticated },
  updatePassword,
  setCurLocation
}) => {
  const history = useHistory()

  const [oldPassword, setoldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');

  const changePassword = () => {
    if (oldPassword !== '' && newPassword !== '' & newPassword2 !== '') {
      if (newPassword === newPassword2) {
        updatePassword(oldPassword, newPassword)
      } else {
        M.toast({
          html: 'Password do not match',
          displayLength: 3500,
          classes: 'red'
        });
      }
    } else {
      M.toast({
        html: 'Fields Required',
        displayLength: 3500,
        classes: 'red'
      });
    }
  }
  
  useEffect(() => {
    setCurLocation(history.location)
  }, [history]);

  return (
    isAuthenticated ? (
      <section className="section section-security">
        <div className="container">
          <h4>Security</h4>
          <div className="row mt-3">
            <form>
              <div className="col s6">
                <div className="input-field relative mb-0">
                  <input type="password" id="old_password" className="validate grey-text text-darken-2 grey lighten-3 pl-2" value={oldPassword} onChange={e => setoldPassword(e.target.value)} required/>
                  <label htmlFor="old_password" className="grey-text text-darken-2 pl-2">Old Password</label>
                  <span className="helper-text" data-error="This field is required"></span>
                </div>
                <div className="input-field relative mb-0">
                  <input type="password" id="new_password" className="validate grey-text text-darken-2 grey lighten-3 pl-2" value={newPassword} onChange={e => setNewPassword(e.target.value)} required/>
                  <label htmlFor="new_password" className="grey-text text-darken-2 pl-2">New Password</label>
                  <span className="helper-text" data-error="This field is required"></span>
                </div>
                <div className="input-field relative mb-0">
                  <input type="password" id="new_password2" className="validate grey-text text-darken-2 grey lighten-3 pl-2" value={newPassword2} onChange={e => setNewPassword2(e.target.value)} required/>
                  <label htmlFor="new_password2" className="grey-text text-darken-2 pl-2">Re-type Password</label>
                  <span className="helper-text" data-error="This field is required"></span>
                </div>
              </div>
              <div className="col s12 mt-4">
                <a className="waves-effect waves-blue btn center blue btn-large" onClick={() => changePassword()}>Change Password</a>
              </div>
            </form>
          </div>
        </div>
      </section>
    ) : (
      <Redirect to="/login"/>
    )
  )
}

Security.propTypes = {
  updatePassword: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { updatePassword })(Security);