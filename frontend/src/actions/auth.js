import {
  REQUEST_LOADING, REQUEST_PROCESSED,
  LOGIN_SUCCESS, SOCIAL_AUTH_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, SIGNUP_SUCCESS, SIGNUP_FAIL,

  USER_LOADED, USER_LOADING, ACTIVATING_USER, USER_ACTIVATED, ACTIVATION_FAILED, USER_UPDATED,
  PASSWORD_UPDATE,
  ADDRESS_ADDED, ADDRESS_DELETED,
  
  UPDATE_ERROR, AUTH_ERROR,

  VERIFYING_PASSWORD_RESET, VERIFIED_PASSWORD_RESET, PASSWORD_RESET_VERIFICATION_ERROR,
  PASSWORD_RESET_DONE
} from '../actions/types';

import axios from 'axios';

export const login = (username, password, history) => async dispatch => {
  dispatch({ type: USER_LOADING })
  const body = {username, password};

  try {
    const res = await axios.post('/api/auth/login', body)
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    })
    M.Toast.dismissAll();
  } catch (err) {
    M.toast({
      html: 'Incorrect authentication details',
      displayLength: 3500,
      classes: 'red',
    });
    dispatch({ type: LOGIN_FAIL });
  }
}

export const logout = () => async (dispatch, getState) => {
  dispatch({ type: USER_LOADING });

  try {
    await axios.post('/api/auth/logout', null, tokenConfig(getState))
    dispatch({ type: LOGOUT_SUCCESS })
  } catch (err) {
    dispatch({ type: AUTH_ERROR })
  }
}

export const signup = ({first_name, last_name, username, email, password}, history) => async dispatch => {
  dispatch({ type: USER_LOADING })
  const body = {
    first_name,
    last_name,
    username,
    email,
    password
  };

  try {
    const res = await axios.post('/api/auth/signup', body)
    console.log(res.data)
    dispatch({ type: SIGNUP_SUCCESS })
    if (res.data.status === "okay") {
      history.push(`/confirm_email/${email}`)
      M.toast({
        html: 'Please activate your account',
        displayLength: 3500,
        classes: 'blue'
      });
    }
  } catch (err) {
    console.log(err)
    M.toast({
      html: 'That username is taken',
      displayLength: 3500,
      classes: 'orange'
    });
    dispatch({ type: SIGNUP_FAIL });
  }
}

export const getFacebookAuthID = async () => {
  const res = await axios.get('/api/auth/facebook_keys')
  return res.data
}

export const socialSignin = ({first_name, last_name, email, picture, facebook_id}, history) => async dispatch => {
  dispatch({
    type: USER_LOADING,
  })

  const fbid = await getFacebookAuthID()
  const body = {
    first_name,
    last_name,
    // username,
    email,
    picture,
    facebook_id,
    fbid: fbid.FACEBOOK_AUTH_ID
  }

  try {
    const res = await axios.post('/api/auth/social_auth', body)
    dispatch({
      type: SOCIAL_AUTH_SUCCESS,
      payload: res.data
    })
    history.push('/')
  } catch (err) {
    console.log(err.response.data)
    if (err.response.data[Object.keys(err.response.data)][0] === "A user with that username already exists.") {
      M.toast({
        html: 'That username is taken',
        displayLength: 3500,
        classes: 'orange'
      });
    } else if (err.response.data[Object.keys(err.response.data)] == "Email with you account already used. Try Logging in") {
      M.toast({
        html: err.response.data,
        displayLength: 3500,
        classes: 'orange'
      });
      history.push('/login')
    } else {
      M.toast({
        html: err.response.data,
        displayLength: 3500,
        classes: 'orange'
      });
    }
    dispatch({ type: SIGNUP_FAIL });
  }
}

export const activate = (uidb64, token, history) => async dispatch => {
  dispatch({ type: ACTIVATING_USER })
  const body = {
    uidb64,
    token,
  };
  const res = await axios.post('/api/auth/activate', body)
  console.log(res.data)
  if (res.data.status === 'okay') {
    dispatch({
      type: USER_ACTIVATED,
      payload: res.data
    })
    M.toast({
      html: 'You have successfully activated your account!',
      displayLength: 3500,
      classes: 'green'
    });
    history.push('/')
  } else {
    M.toast({
      html: 'Activation error',
      displayLength: 3500,
      classes: 'red'
    });
    dispatch({ type: ACTIVATION_FAILED });
  }
  // try {
  // } catch (err) {
  //   setAlert({ type: 'danger', msg: err.response.data });
  // }
}

export const getServerToken = async () => {
  const res = await axios.get('/api/auth/token')
  return res.data
}

// Check Token and Load User
export const loadUser = () => async (dispatch, getState) => {
  dispatch({ type: USER_LOADING });
  const token = await getServerToken()
  if (token) {
    try {
      const res = await axios.get('/api/auth/user', tokenConfig(getState, token))
      dispatch({
        type: USER_LOADED,
        payload: res.data,
        token: token
      })
    } catch (err) {
      dispatch({type: AUTH_ERROR});
    }
  } else {
    dispatch({type: AUTH_ERROR});
  }
}

// Update User
export const updateUser = body => async (dispatch, getState) => {
  dispatch({ type: USER_LOADING });

  try {
    const res = await axios.put('/api/auth/user', body, tokenConfig(getState))
    dispatch({ 
      type: USER_UPDATED,
      payload: res.data
    })
    M.toast({
      html: 'Changes Saved',
      displayLength: 3500,
      classes: 'green',
    });
  } catch (err) {
    dispatch({ type: AUTH_ERROR })
  }
}

export const addAddress = body => async (dispatch, getState) => {
  dispatch({ type: USER_LOADING });

  try {
    const res = await axios.post('/api/auth/address/', body, tokenConfig(getState))
    dispatch({ 
      type: ADDRESS_ADDED,
      payload: res.data
    })
  } catch (err) {
    dispatch({ type: AUTH_ERROR })
  }
}

export const getAddress = id => async (dispatch, getState) => {
  if (id) {
    try {
      const res = await axios.get(`/api/auth/address/${id}/`, tokenConfig(getState))
      return res.data
    } catch (error) {
      return null
    }
  }
}

export const deleteAddress = id => async (dispatch, getState) => {
  dispatch({ type: USER_LOADING });

  try {
    const res = await axios.delete(`/api/auth/address/${id}/`, tokenConfig(getState))
    dispatch({ 
      type: ADDRESS_DELETED,
      payload: id
    })
  } catch (err) {
    dispatch({ type: AUTH_ERROR })
  }
}

// Update Password
export const updatePassword = (old_password, new_password) => async (dispatch, getState) => {;
  dispatch({ type: USER_LOADING })
  const body = {
    old_password,
    new_password,
  };

  try {
    const res = await axios.put('/api/auth/change_password', body, tokenConfig(getState))
    if (res.data.status === 'okay') {
      dispatch(setAlert({type:'success', msg: res.data.message}));
      dispatch({
        type: PASSWORD_UPDATE,
      })
      return 'okay'
    } else if (res.data.status === 'error') {
      dispatch(setAlert({type:'danger', msg: res.data.message}));
      dispatch({ type: UPDATE_ERROR })
      return 'wrong password'
    }
  } catch (err) {
    dispatch({ type: UPDATE_ERROR })
    if (err.response.data[Object.keys(err.response.data)] === 'Invalid token.') {
      dispatch({type: AUTH_ERROR});
      dispatch(setAlert({ type:'danger', msg:'Session timed out. Please login again.' }));
    } else {
      dispatch(setAlert({type:'danger', msg:err.response.data[Object.keys(err.response.data)][0]}));
    }
    return 'error'
  }
}

// Request Password Reset
export const requestPasswordReset = (email, history) => async (dispatch, getState) => {;
  dispatch({ type: REQUEST_LOADING })
  const body = {
    email,
  }

  try {
    const res = await axios.post('/api/auth/request_password_reset', body)
    if (res.data.status === 'okay') {
      history.push(`/check_email/${email}`)
    } else if (res.data.status === 'error') {
      history.push(`/check_email/${email}`)
    }
    dispatch({ type: REQUEST_PROCESSED })
  } catch (err) {
    console.log(err.response.data)
    dispatch({ type: REQUEST_PROCESSED })
    dispatch(setAlert({type:'danger', msg:err.response.data[Object.keys(err.response.data)][0]}));
    return 'error'
  }
}

export const verifyPasswordReset = (uidb64, token) => async dispatch => {
  dispatch({ type: VERIFYING_PASSWORD_RESET })
  const body = {
    uidb64,
    token,
  };
  const res = await axios.post('/api/auth/verify_password_reset', body)
  if (res.data.status === 'okay') {
    dispatch({ 
      type: VERIFIED_PASSWORD_RESET,
      payload: res.data
    })
  } else {
    dispatch({ type: PASSWORD_RESET_VERIFICATION_ERROR })
  }
}

export const resetPassword = (uidb64, token, newPassword, history) => async dispatch => {
  dispatch({ type: VERIFYING_PASSWORD_RESET })
  const body = {
    uidb64,
    token,
    new_password: newPassword
  };
  const res = await axios.put('/api/auth/reset_password', body)
  if (res.data.status === 'okay') {
    dispatch({ 
      type: PASSWORD_RESET_DONE,
    })
    history.push('/login')
  } else {
    dispatch({ type: PASSWORD_RESET_VERIFICATION_ERROR })
  }
}

// Setup config with token
export const tokenConfig = (getState, rtoken) => {
  let token
  if (rtoken) {
    token = rtoken; 
  } else {
    token = getState().auth.token; 
  }
  
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  if(token) {
    config.headers['Authorization'] = `Token ${token}`;
  }

  return config
}