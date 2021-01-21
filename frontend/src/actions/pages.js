import axios from 'axios';
import { tokenConfig } from './auth'

import {
  ARTICLES_LOADING, ARTICLE_PAGE,
  GET_ARTICLES,

  ARTICLE_LOADING,
  GET_ARTICLE,
  ARTICLE_ERROR,
  
  CONTACTING,
  CONTACTED,

  SERVICE_LOADING,
  GET_SERVICES,
  SERVICE_ERROR,

  EVENT_LOADING,
  GET_EVENT,
  EVENT_ERROR,
  
  AUTH_ERROR
} from './types'

// Articles
export const setPage = (page, history) => async dispatch => {
  dispatch({
    type: ARTICLE_PAGE,
    payload: page,
  })
}

export const updateQuery = history => async (dispatch, getState) => {
  let pagePath = ''
  const { currentPage } = getState().articles;

  // Set Paths
  if (currentPage) pagePath = `page=${currentPage}`
  history.push({ search: `?${pagePath}`})
}

export const getArticles = ({ page }) => async (dispatch, getState) => {
  $('.loader').fadeIn();
  // dispatch({ type: ARTICLES_LOADING });

  let pageQuery = ''
  // const { currentPage } = getState().articles;
  if (page) pageQuery = `?page=${page}`

  try {
    const res = await axios.get(`/api/articles/${pageQuery}`)
    dispatch({
      type: GET_ARTICLES,
      payload: res.data,
    });
    $('.loader').fadeOut();
  } catch (err) {
    console.error(err)
    $('.loader').fadeOut();
  }
}

export const getArticle = articleID => async dispatch => {
  dispatch({ type: ARTICLE_LOADING });

  try {
    const res = await axios.get(`/api/article/${articleID}/`)
    
    dispatch({
      type: GET_ARTICLE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: ARTICLE_ERROR,
      payload: err.response.statusText
    });
  }
}

export const getService = ({ serviceQuery, history }) => async dispatch => {
  dispatch({ type: SERVICE_LOADING });
  
  try {
    const res = await axios.get(`/api/service/${serviceQuery ? serviceQuery : '1'}/`)
    history.push(`/services?s=${res.data.service.id}`)
    dispatch({
      type: GET_SERVICES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({ type: SERVICE_ERROR });
  }
}

export const getEvent = ({ eventQuery, history }) => async dispatch => {
  dispatch({ type: EVENT_LOADING });
  
  try {
    const res = await axios.get(`/api/event/${eventQuery ? eventQuery : '1'}/`)
    history.push(`/events?e=${res.data.event.id}`)
    dispatch({
      type: GET_EVENT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({ type: EVENT_ERROR });
  }
}

// Contact
export const addInquiry = inquiry => async (dispatch, getState) => {
  dispatch({type: CONTACTING})
  try {
    await axios.post('/api/contact/', inquiry, tokenConfig(getState));
    dispatch({type: CONTACTED})
    M.toast({
      html: 'Message sent!',
      displayLength: 3500,
      classes: 'green',
    });
  } catch (err) {
    dispatch({type: CONTACTED})
    dispatch({type: AUTH_ERROR});
  }
}
