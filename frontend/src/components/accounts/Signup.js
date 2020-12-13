import React, { Fragment, useEffect, useState } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import FacebookLogin from 'react-facebook-login';

import { signup, socialSignin } from '../../actions/auth'

const Signup = ({
  auth: {isAuthenticated, userLoading },
  signup,
  socialSignin
}) => {
  const history = useHistory()

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const makeID = (length) => {
    let result = '';
    let characters = '0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  
  const onSubmit = e => {
    e.preventDefault();

    if (firstName && lastName && email && password1 && password2 ? true : false) {
      if (password1 === password2) {
        const newUser = {
          first_name: firstName,
          last_name: lastName,
          email,
          password: password1
        }
        signup(newUser, history)
      } else {
        M.toast({
          html: 'Passwords do not match',
          displayLength: 3500,
          classes: 'red'
        });
      }
    } else {
      M.toast({
        html: 'Please fill in all fields',
        displayLength: 3500,
        classes: 'red'
      });
    }
  }

  const responseFacebook = async (response) => {
    if (response.status !== 'unknown') {
      const nameArr = response.name.split(" ")
      const newUsername = ((nameArr[0]+(nameArr[1] ? nameArr[1] : '')).toLowerCase())+makeID(4)
      
      const newUser = {
        first_name: response.name,
        last_name: '',
        // username: newUsername,
        email: response.email,
        picture: response.picture.data.url,
        facebook_id: response.userID,
      }
      socialSignin(newUser, history)
    }
  }

  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      $('.loader').fadeOut();
      $('#middle-content').fadeIn();
    }
  }, [userLoading])
  
  return (
    <Fragment>
      <section className="section section-signup">
        <div className="container">
          <div className="row mb-0">
            <div className="col s12 m8 offset-m2">
              <div className="card-panel mt-5">
                <h4 className="center mb-5">Signup</h4>
                <form method="post" noValidate onSubmit={onSubmit}>
                  <div className="input-field">
                    <input type="text" id="firstName" onChange={e => setFirstName(e.target.value)} className="validate" maxLength="30" required/>
                    <label htmlFor="firstName">First Name</label>
                    <span className="helper-text" data-error="This field is required"></span>
                  </div>
                  <div className="input-field">
                    <input type="text" id="lastName" onChange={e => setLastName(e.target.value)} className="validate" maxLength="30" required/>
                    <label htmlFor="lastName">Last Name</label>
                    <span className="helper-text" data-error="This field is required"></span>
                  </div>
                  <div className="input-field">
                    <input type="email" id="email" onChange={e => setEmail(e.target.value)} className="validate" required/>
                    <label htmlFor="email">Email</label>
                    <span className="helper-text" data-error="Please enter a valid email"></span>
                  </div>
                  <div className="input-field">
                    <span className="visibility"><i className="material-icons waves-effect" onClick={() => setShowPassword1(!showPassword1)}>visibility</i></span>
                    <input type={showPassword1 ? 'text' : 'password'} id="password1" onChange={e => setPassword1(e.target.value)} className="validate" required/>
                    <label htmlFor="password1">Password</label>
                    <span className="helper-text" data-error="Please enter a valid email">Your password must contain at least 8 characters</span>
                  </div>
                  <div className="input-field">
                    <span className="visibility-2"><i className="material-icons waves-effect" onClick={() => setShowPassword2(!showPassword2)}>visibility</i></span>
                    <input type={showPassword2 ? 'text' : 'password'} id="password2" onChange={e => setPassword2(e.target.value)} className="validate" required/>
                    <label htmlFor="password2">Re-enter Password</label>
                  </div>
                  <button type="submit" className="btn btn-large btn-extended green">Create account</button>
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

                      textButton="Facebook Signup"
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
              <p className="grey-text lighten-1">Already have an account? <Link to="/login" className="blue-text">Login</Link></p>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
}

Signup.propTypes = {
  signup: PropTypes.func.isRequired,
  socialSignin: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { signup, socialSignin })(Signup);