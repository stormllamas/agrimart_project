import React from 'react';
import { Link } from 'react-router-dom';

const ConfirmEmail = ({ match }) => {
  return (
    <section className="section section-confirm-email">
      <div className="row">
        <div className="col s12 m6 offset-m3">
          <div className="card-panel center">
            <h4 className="card-title">Confirm Your Email</h4>
            <p>We've sent you a confirmation email. Please check your email by checking your inbox and clicking the link at</p>
            <p className="fs-18 fw-8 mt-3 mb-4">{ match.params.email }</p>
            <Link to="/login" className="btn btn-large blue">Return to log in</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default (ConfirmEmail);
  