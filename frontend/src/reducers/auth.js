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
import moment from 'moment'

const initialState = {
  token: null,
  isAuthenticated: null,
  
  user: null,

  activatingUser: false,
  userLoading: true,
  requestLoading: false,

  passwordResetVerifying: true,
  passwordResetValid: false,
};

export default function(state=initialState, action) {
  switch(action.type) {
    case VERIFYING_PASSWORD_RESET:
      return {
        ...state,
        passwordResetVerifying: true,
      }

    case VERIFIED_PASSWORD_RESET:
      return {
        ...state,
        passwordResetValid: true,
        passwordResetVerifying: false,
        user: action.payload.user
      }

    case PASSWORD_RESET_VERIFICATION_ERROR:
      return {
        ...state,
        passwordResetValid: false,
        passwordResetVerifying: false,
      }

    case PASSWORD_RESET_DONE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        passwordResetVerifying: false,
      }

    case REQUEST_LOADING:
      return {
        ...state,
        requestLoading: true,
      }

    case REQUEST_PROCESSED:
      return {
        ...state,
        requestLoading: false,
      }
      
    case USER_LOADING:
      return {
        ...state,
        userLoading: true,
      }
      
    case ACTIVATING_USER:
      return {
        ...state,
        activatingUser: true,
      }
      
    case USER_ACTIVATED:
      return {
        ...state,
        ...action.payload,
        activatingUser: false,
        isAuthenticated: true,
        userLoading: false,
      }

    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        userLoading: false,
        user: action.payload,
        token: action.token ? action.token : state.token
      }

    case USER_UPDATED:
      state.user.first_name = action.payload.first_name ? action.payload.first_name : state.user.first_name
      state.user.last_name = action.payload.last_name ? action.payload.last_name : state.user.last_name 
      state.user.contact = action.payload.contact ? action.payload.contact : state.user.contact 
      state.user.gender = action.payload.gender ? action.payload.gender : state.user.gender 
      return {
        ...state,
        userLoading: false,
      }

    case ADDRESS_ADDED:
      const newArray = [...state.user.addresses, action.payload]
      state.user.addresses = newArray
      return {
        ...state,
        userLoading: false
      }

    case ADDRESS_DELETED:
      const reducedArray = state.user.addresses.filter(address => address.id !== action.payload)
      state.user.addresses = reducedArray
      return {
        ...state,
        userLoading: false
      }

    case PASSWORD_UPDATE:
    case UPDATE_ERROR:
      return {
        ...state,
        userLoading: false,
      }

    case LOGIN_SUCCESS:
    case SOCIAL_AUTH_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        userLoading: false,
      }

    case SIGNUP_SUCCESS:
      return {
        ...state,
        userLoading: false,
      }

    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case SIGNUP_FAIL:
      document.cookie = `token=; expires=${moment().subtract(30, 'm').toDate()};`
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        userLoading: false,
      }

    case ACTIVATION_FAILED:
      document.cookie = `token=; expires=${moment().subtract(30, 'm').toDate()};`
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        activatingUser: false,
      }

    default:
      return state;
  }
}