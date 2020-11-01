import React, { Fragment, useEffect } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import Preloader from '../../layout/Preloader';

import { connect } from 'react-redux';

const PasswordResetPrompt = ({
  match,
  auth: { userLoading, isAuthenticated },
}) => {
  const history = useHistory()

  if (!userLoading&&isAuthenticated) {return ( <Redirect to='/' /> )}
  return (
    <Fragment>
      {userLoading ? <Preloader /> : undefined}
      <section id="password-reset-prompt" className="auth col center middle">
        <div className="pass-reset card col center">
          <div className="card-body col center">
            <h1 className="card-title">Reset your password</h1>
            <p className="text-center">Check your email <span className="text-mute">{ match.params.email }</span> for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.</p>
            <Link to="/login" className="btn-blue">Return to log in</Link>
          </div>
        </div>
      </section>
    </Fragment>
  )
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PasswordResetPrompt);