import React, { Fragment, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'

import Preloader from '../layout/Preloader';

import { connect } from 'react-redux';
import { activate } from '../../actions/auth';

const Activate = ({ isAuthenticated, activatingUser, activate, match }) => {
  const history = useHistory()

  useEffect(() => {
    const uidb64 = match.params.uidb64
    const token = match.params.token
    activate(uidb64, token, history)
  }, [])

  return (
    (!activatingUser && isAuthenticated ? (
      <Redirect to="/" />
    ):(
      <Fragment>
        {activatingUser ? <Preloader /> : undefined}
        <section id="activate" className="auth col center middle">
        </section>
      </Fragment>
    ))
  )
}

Activate.propTypes = {
  activate: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { activate })(Activate);