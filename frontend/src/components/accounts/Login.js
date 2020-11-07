import React, { Fragment, useEffect, useState } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { useHistory, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import FacebookLogin from 'react-facebook-login';

import { login, socialSignin } from '../../actions/auth';

const Login = ({
  auth: {isAuthenticated, userLoading },
  socialSignin,
  login
}) => {
  const history = useHistory()

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async e => {
    e.preventDefault();

    if(username && password) {
      await login(username, password, history)
    }
  }

  const responseFacebook = (response) => {
    if (response.status !== 'unknown') {
      const body = {
        first_name: response.name,
        last_name: '',
        email: response.email,
        picture: response.picture.data.url,
        facebook_id: response.userID,
      }
      socialSignin(body, history)
    }
  }

  return (
    <section className="section section-login">
      <div className="container">
        <div className="row mb-0">
          <div className="col s12 m8 offset-m2 l6 offset-l3">
            <div className="card-panel mt-5">
              <h4 className="center mb-5">Login</h4>
              <form method="post" onSubmit={onSubmit} noValidate>
                <div className="input-field">
                  <i className="material-icons prefix">person</i>
                  <input type="text" id="user" className="validate" required onChange={e => setUsername(e.target.value)}/>
                  <label htmlFor="user">Email</label>
                </div>
                <div className="input-field">
                  <i className="material-icons prefix">lock</i>
                  <input type="password" id="password" className="validate" onChange={e => setPassword(e.target.value)} required/>
                  <label htmlFor="password">Password</label>
                </div>
                <button type="submit" className="btn btn-large btn-extended green">Login</button>
              </form>
              <div className="row valign-wrapper mt-2">
                <div className="col s5 p-3">
                  <div className="divider"></div>
                </div>
                <div className="col s2 center">
                  <p>OR</p>
                </div>
                <div className="col s5 p-3">
                  <div className="divider"></div>
                </div>
              </div>
              <div className="row">
                <div className="col s12">
                  <FacebookLogin
                  appId="1664782137013953"
                  autoLoad={false}
                  fields="name,email,picture"
                  callback={responseFacebook}
                  isMobile={false}
                  
                  textButton="Facebook Login"
                  icon="fab fa-facebook mr-2"
                  cssClass="btn btn-large btn-extended blue darken-2 mt-0 pr-1 pl-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-0">
          <div className="col s12 center">
            <p className="grey-text lighten-1">Don't have an account? <Link to="/signup" className="blue-text">Signup</Link></p>
          </div>
          <div className="col s12 center">
            <p className="grey-text lighten-1 mt-0"><Link to="/password_reset" className="blue-text">Forgot your Password?</Link></p>
          </div>
        </div>
      </div>
    </section>
  )
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  socialSignin: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { login, socialSignin })(Login);