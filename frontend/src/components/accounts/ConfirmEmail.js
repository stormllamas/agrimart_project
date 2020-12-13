import React from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { resendActivation } from '../../actions/auth'

const ConfirmEmail = ({
  resendActivation,
  match
}) => {
  const history = useHistory()

  return (
    <section className="section section-confirm-email mt-5">
      <div className="row">
        <div className="col s12 m6 offset-m3">
          <div className="card-panel center">
            <h4 className="card-title">Confirm Your Email</h4>
            <p>We've sent you a confirmation email. Please check your email by checking your inbox and clicking the link at</p>
            <p className="fs-18 fw-8 mt-3 mb-4">{ match.params.email }</p>
            <p>If you did not receive an email form us within 5mins please click the button below to request another activation link from us</p>
            <button className="btn btn-large green mt-2" onClick={() => resendActivation({ email: match.params.email }, history)} >Resend Activation Email</button>
          </div>
        </div>
      </div>
    </section>
  )
}

ConfirmEmail.propTypes = {
  resendActivation: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, { resendActivation })(ConfirmEmail);