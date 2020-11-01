import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'

import Preloader from '../../layout/Preloader';

import { connect } from 'react-redux';
import { requestPasswordReset } from '../../../actions/auth';

const PasswordReset = ({
  auth: { requestLoading, userLoading, isAuthenticated },
  requestPasswordReset, validateField, validateForm
}) => {
  const history = useHistory()

  const [email, setEmail] = useState('');

  const onSubmit = async e => {
    e.preventDefault();
    const formValidation = {}
    formValidation[validateField(document.getElementById('id_email'), ['required', 'email'])] = true

    const validForm = validateForm(formValidation)
    validForm && await requestPasswordReset(email, history)
  }

  if (!userLoading&&isAuthenticated) {
    return ( <Redirect to='/' /> )
  }

  return (
    <Fragment>
      {userLoading||requestLoading ? <Preloader /> : undefined}
      {!userLoading && (
        <div className="auth row center middle">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center">Reset your password</h1>
              <p className="text-center prompt">Enter your email address and we will send a link to your email to reset your password.</p>
              <form method="post" className="col center reset" onSubmit={onSubmit} noValidate>
                <div className="form-group">
                  <input type="email" name="email" value={email} autoFocus maxLength="254" className="form-control" required id="id_email" onChange={e => setEmail(e.target.value)} required />
                </div>
                <button type="submit" className="btn-blue">Send password reset email</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  )
}

PasswordReset.propTypes = {
  requestPasswordReset: PropTypes.func.isRequired,
  validateForm: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { requestPasswordReset })(PasswordReset);