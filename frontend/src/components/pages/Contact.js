import React, { useState, Fragment, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'

import Preloader from '../layout/Preloader';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import ReCAPTCHA from "react-google-recaptcha";

import { connect } from 'react-redux';
import { addInquiry } from '../../actions/pages';

const Contact = ({
  auth: { userLoading, user },
  contacting,
  addInquiry, validateForm, validateField,
}) => {
  const history = useHistory()

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [captchaValid, setCaptchaValid] = useState(false);

  useEffect(() => {
    setName(user? user.first_name+' '+user.last_name : '')
    setEmail(user? user.email : '')
    setPhone(user? user.contact ? user.contact : '' : '')
  // eslint-disable-next-line
  }, [user]);

  const onSubmit = async e => {
    e.preventDefault();
    const formValidation = {}
    formValidation[validateField(document.getElementById('id_name'), ['required'])] = true
    formValidation[validateField(document.getElementById('id_email'), ['email'])] = true
    formValidation[validateField(document.getElementById('id_phone'), ['required'])] = true
    formValidation[validateField(document.getElementById('id_subject'))] = true
    formValidation[validateField(document.getElementById('id_message'), ['required'])] = true

    let validForm = validateForm(formValidation)
    if(!captchaValid) {
      setAlert({type: 'danger', msg:'Please check captcha box'})
      validForm = false
    }
    if (validForm) {
      addInquiry({
        name,
        email,
        phone,
        subject,
        message,
      });
      setName('');document.getElementById('id_name').classList.remove('is-valid')
      setEmail('');document.getElementById('id_email').classList.remove('is-valid')
      setPhone('');document.getElementById('id_phone').classList.remove('is-valid')
      setSubject('');document.getElementById('id_subject').classList.remove('is-valid')
      setMessage('');document.getElementById('id_message').classList.remove('is-valid')
    }
  }

  return (
    <Fragment>
      {userLoading || contacting ? <Preloader /> : undefined}
      <Header />
      <section id="contact-form" className="page col center">
        <div className="contact-dialog card container-short">
          {!userLoading ? (
            <div className="contact-content">
              <h2 className="contact-title">Send us a Message</h2>
              <hr/>
              <form method="POST" noValidate className="col" onSubmit={onSubmit}>
                <div className="three-forms row">
                  <div className="form-group">
                    <label htmlFor="id_name">Name</label>
                    <input type="text" name="name" rows="1" value={name} maxLength="50" className="form-control" id="id_name" required onChange={e => setName(e.target.value)} onBlur={e => validateField(e.target, ['required'])} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="id_email">Email</label>
                    <input type="text" name="email" rows="1" value={email} maxLength="50" className="form-control" id="id_email" required onChange={e => setEmail(e.target.value)} onBlur={e => {validateField(e.target, ['required', 'email'])}} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="id_phone">Phone</label>
                    <input type="text" name="phone" rows="1" value={phone} maxLength="50" className="form-control" id="id_phone" required onChange={e => setPhone(e.target.value)} onBlur={e => validateField(e.target, ['required'])} />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="id_subject">Subject</label>
                  <input type="text" name="subject" rows="1" maxLength="200" value={subject} className="form-control " id="id_subject" onChange={e => setSubject(e.target.value)} onBlur={e => {validateField(e.target)}} />
                </div>
                <div className="form-group">
                  <label htmlFor="id_message">Message</label>
                  <textarea name="message" cols="40" rows="10" placeholder="What's on your mind?" value={message} maxLength="4000" className="form-control " id="id_message" required onChange={e => setMessage(e.target.value)} onBlur={e => validateField(e.target, ['required'])} ></textarea>
                  <small className="form-text text-muted">
                    4000 characters allowed
                  </small>
                </div>
                <div id="google-captcha-group" className="col center">
                  <ReCAPTCHA
                    sitekey="6LdI07kZAAAAALyPntSsASXPCw8f8Gaq3MB_2mje"
                    onChange={() => setCaptchaValid(true)}
                  />
                </div>
                <button type="submit" className="btn-green" onClick={onSubmit}>Send Message</button>
              </form>
            </div>
          ) : undefined}
        </div>
      </section>
      <Footer/>
    </Fragment>
  )
}

Contact.propTypes = {
  addInquiry: PropTypes.func.isRequired,
  validateField: PropTypes.func.isRequired,
  validateForm: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  contacting: state.contact.contacting
});

export default connect(mapStateToProps, {  addInquiry })(Contact);
