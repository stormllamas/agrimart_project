import React from 'react';
import { Link } from 'react-router-dom';

const ConfirmEmail = ({ match }) => {
  return (
    <section id="confirm-email" className="auth row center middle">
      <div className="card col center">
        <div className="card-body col center">
          <h1 className="card-title">Confirm Your Email</h1>
          <p id="confirm-email-prompt" className="text-center">We've sent you a confirmation email. Please confirm your email by checking your inbox and clicking the link at <span className="email">{ match.params.email }</span></p>
          <Link to="/login" className="btn-blue">Return to log in</Link>
        </div>
      </div>
    </section>
  )
}

export default (ConfirmEmail);
  