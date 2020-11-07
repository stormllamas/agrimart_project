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
    if (res.data.status === "okay") {
      dispatch({ type: SIGNUP_SUCCESS })
      history.push(`/confirm_email/${email}`)
      M.toast({
        html: 'Please activate your account',
        displayLength: 3500,
        classes: 'blue'
      });
    }
  } catch (err) {
    dispatch({ type: SIGNUP_FAIL });
    M.toast({
      html: 'That email is taken',
      displayLength: 3500,
      classes: 'orange'
    });
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
    M.toast({
      html: 'Authentication error',
      displayLength: 3500,
      classes: 'orange'
    });
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
      dispatch({ type: PASSWORD_UPDATE })
      M.toast({
        html: res.data.message,
        displayLength: 3500,
        classes: 'green',
      });
      return 'okay'
    } else {
      dispatch({ type: UPDATE_ERROR })
      M.toast({
        html: res.data.message,
        displayLength: 3500,
        classes: 'red',
      });
      return 'wrong password'
    }
  } catch (err) {
    dispatch({ type: UPDATE_ERROR })
    M.toast({
      html: 'Session timed out. Please login again.',
      displayLength: 3500,
      classes: 'red',
    });
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
      M.toast({
        html: res.data.msg,
        displayLength: 3500,
        classes: 'green',
      });
      dispatch({ type: REQUEST_PROCESSED })
      return 'okay'
    } else {
      M.toast({
        html: res.data.msg,
        displayLength: 3500,
        classes: 'red',
      });
      dispatch({ type: REQUEST_PROCESSED })
      return 'error'
    }
  } catch (err) {
    M.toast({
      html: res.data.msg,
      displayLength: 3500,
      classes: 'red',
    });
    dispatch({ type: REQUEST_PROCESSED })
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
    M.toast({
      html: 'Password reset successful',
      displayLength: 3500,
      classes: 'green',
    });
    dispatch({ type: PASSWORD_RESET_DONE })
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