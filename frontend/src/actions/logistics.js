import moment from 'moment'
import axios from 'axios';
import {
  GET_HIGHLIGHTS,
  
  GET_FILTER_DETAILS,

  SELLER_LOADING, 
  GET_SELLER, SELLER_ERROR,

  SELLER_PRODUCTS_LOADING, 
  GET_SELLER_PRODUCTS,
  SELLER_PRODUCTS_ERROR,
  MORE_SELLER_PRODUCTS_LOADING,
  GET_MORE_SELLER_PRODUCTS,
  SELLER_PRODUCTS_PAGE,
  
  PRODUCTS_LOADING,
  GET_PRODUCTS,
  PRODUCTS_ERROR,
  MORE_PRODUCTS_LOADING,
  GET_MORE_PRODUCTS,
  PRODUCTS_PAGE,
  
  PRODUCT_LOADING,
  GET_PRODUCT, PRODUCT_ERROR,

  FILTER_KEYWORDS, CLEAR_KEYWORDS,
  FILTER_CATEGORY, REMOVE_CATEGORY, CLEAR_CATEGORY,
  FILTER_SELLER, REMOVE_SELLER, CLEAR_SELLER,

  CURRENT_ORDER_LOADING, GET_CURRENT_ORDER,
  CURRENT_ORDER_ERROR,

  ORDERS_LOADING, MORE_ORDERS_LOADING,
  GET_ORDERS, ORDERS_ERROR,
  GET_MORE_ORDERS, SET_ORDERS_PAGE,
  FILTER_CURRENT_ONLY,

  ORDER_LOADING,
  GET_ORDER,
  ORDER_ERROR,
  REVIEW_ORDER,

  ORDER_ITEM_LOADING, GET_ORDER_ITEM,
  ORDER_ITEM_ERROR,
  REVIEW_PRODUCT,
  REVIEW_PRODUCT_ORDER,

  QUANTITY_LOADING,
  QUANTITY_CHANGED,
  QUANTITY_CHANGE_ERROR,
  
  DELETE_LOADING,
  DELETE_ORDER_ITEM,
  DELETE_ERROR,

  CHECKOUT_LOADING,
  CHECKOUT_SUCCESS,
  CHECKOUT_FAILED,

  COMPLETE_ORDER_LOADING,
  COMPLETE_ORDER_SUCCESS,
  COMPLETE_ORDER_FAILED,

  FAVORITES_LOADING, GET_FAVORITES, DELETE_FAVORITE,
  USER_UPDATED,
  
  AUTH_ERROR,
} from './types'

import { tokenConfig } from '../actions/auth';

export const getHighlightsData = () => async dispatch => {
  const res = await axios.get('/api/highlights')

  dispatch({
    type: GET_HIGHLIGHTS,
    payload: res.data,
  });
}

export const getFilterDetails = () => async dispatch => {
  const res = await axios.get('/api/filter_details')

  dispatch({
    type: GET_FILTER_DETAILS,
    payload: res.data,
  });
}

export const getSeller = sellerName => async dispatch => {
  dispatch({ type: SELLER_LOADING });

  try {
    const res = await axios.get(`/api/seller/${sellerName}/`)
    dispatch({
      type: GET_SELLER,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: SELLER_ERROR,
    });
  }
}
export const getSellerProducts = ({ sellerName, getMore }) => async (dispatch, getState) => {
  try {
    if (!getMore) {
      dispatch({ type: SELLER_PRODUCTS_LOADING });
      const res = await axios.get(`/api/products?brand=${sellerName.replaceAll('-', ' ')}`)
      dispatch({
        type: GET_SELLER_PRODUCTS,
        payload: res.data,
      });
    } else {
      dispatch({ type: MORE_SELLER_PRODUCTS_LOADING })
      const { sellerProductsPage } = getState().logistics;
    
      await dispatch({
        type: SELLER_PRODUCTS_PAGE,
        payload: parseInt(sellerProductsPage) + 1
      });
      const res = await axios.get(`/api/products?page=${getState().logistics.sellerProductsPage}&brand=${sellerName.replaceAll('-', ' ')}`)
      dispatch({
        type: GET_MORE_SELLER_PRODUCTS,
        payload: res.data,
      });
    }
  } catch (err) {
    console.log(err)
    dispatch({ type: SELLER_PRODUCTS_ERROR });
    dispatch({ type: AUTH_ERROR});
  }
}

// PRODUCTS
export const getProducts = ({ getMore }) => async (dispatch, getState) => {
  try {
    if (!getMore) {
      dispatch({ type: PRODUCTS_LOADING })
      const { categoryQuery, brandQuery, keywordsQuery } = setQueries(getState)
      
      const res = await axios.get(`/api/products?${categoryQuery}${brandQuery}${keywordsQuery}`)
      dispatch({
        type: GET_PRODUCTS,
        payload: res.data,
      });
    } else {
      dispatch({ type: MORE_PRODUCTS_LOADING })
      const { categoryQuery, brandQuery, keywordsQuery } = setQueries(getState)
      const { productsPage } = getState().logistics;
    
      dispatch(setProductsPage(parseInt(productsPage) + 1));
      const res = await axios.get(`/api/products?page=${getState().logistics.productsPage}${keywordsQuery}${categoryQuery}${brandQuery}`)
      dispatch({
        type: GET_MORE_PRODUCTS,
        payload: res.data,
      });
    }
  } catch (err) {
    dispatch({ type: PRODUCTS_ERROR });
    dispatch({ type: AUTH_ERROR});
  }
}
const setQueries = (getState) => {
  let categoryQuery = '', brandQuery = '', keywordsQuery = ''
  const { productsPage, categoryFilter, sellerFilter, keywordsFilter } = getState().logistics;
  
  // Set Queries
  categoryFilter.length > 0 && categoryFilter.sort().forEach(c => categoryQuery += `&category=${c}`)
  sellerFilter.length > 0 && sellerFilter.sort().forEach(s => brandQuery += `&brand=${s}`)
  if (keywordsFilter) keywordsQuery = `&keywords=${keywordsFilter}`

  return {categoryQuery, brandQuery, keywordsQuery}
}
export const clearCategory = () => {return { type: CLEAR_CATEGORY }}
export const clearSeller = () => {return { type: CLEAR_SELLER }}
export const clearKeywords = () => {return { type: CLEAR_KEYWORDS }}
export const setProductsPage = page => {
  return {
    type: PRODUCTS_PAGE,
    payload: page
  }
}
export const setCategory = ( category, value ) => async dispatch => {
  dispatch({
    type: value ? FILTER_CATEGORY : REMOVE_CATEGORY,
    payload: category,
  })
}
export const setSeller = (seller, value) => async dispatch => {
  dispatch({
    type: value === true ? FILTER_SELLER : REMOVE_SELLER,
    payload: seller,
  })
}
export const setKeywords = text => async dispatch => {
  dispatch({
    type: FILTER_KEYWORDS,
    payload: text,
  })
}
export const updateQuery = history => async (dispatch, getState) => {
  let categoryPath = '', brandPath = '', keywordsPath = ''
  const { categoryFilter, sellerFilter, keywordsFilter } = getState().logistics;

  // Set Paths
  if (categoryFilter.length > 0) categoryFilter.sort().forEach((c,i) => i === 0 ? categoryPath += `&category=${c.replaceAll(' ', '-')}` : categoryPath += `--${c.replaceAll(' ', '-')}`)
  if (sellerFilter.length > 0) sellerFilter.sort().forEach((c,i) => i === 0 ? brandPath += `&brand=${c.replaceAll(' ', '-')}` : brandPath += `--${c.replaceAll(' ', '-')}`)
  if (keywordsFilter) keywordsPath = `&keywords=${keywordsFilter.replaceAll(' ', '-')}`

  history.push({ search: `?${keywordsPath}${categoryPath}${brandPath}`})
}

// PRODUCT
export const getProduct = ({ productQuery }) => async (dispatch, getState) => {

  try {
    dispatch({ type: PRODUCT_LOADING });
    const res = await axios.get(`/api/product/${productQuery}`)
    dispatch({
      type: GET_PRODUCT,
      payload: res.data,
    })
  } catch (err) {
    dispatch({ type: PRODUCT_ERROR });
    dispatch({ type: AUTH_ERROR});
  }
}

// CURRENT ORDER
export const getCurrentOrder = ({ query, updateOnly }) => async (dispatch, getState) => {
  !updateOnly && dispatch({ type: CURRENT_ORDER_LOADING });
  try {
    const res = await axios.get(`/api/current_order/?${query ? query : ''}`, tokenConfig(getState))
    dispatch({
      type: GET_CURRENT_ORDER,
      payload: res.data,
    })
  } catch (err) {
    dispatch({ type: CURRENT_ORDER_ERROR });
    dispatch({ type: AUTH_ERROR });
  }
}

// ORDERS
export const getOrders = ({ getMore }) => async (dispatch, getState) => {
  try {
    if (!getMore) {
      dispatch({ type: ORDERS_LOADING });
      const { ordersCurrentPage, currentOnly } = getState().logistics;
      const ordersQuery = `page=${ordersCurrentPage}`
      const orders = await axios.get(`/api/orders/?${ordersQuery}${currentOnly ? `&delivered=false`: ''}`, tokenConfig(getState))
      dispatch({
        type: GET_ORDERS,
        payload: orders.data,
      })
    } else {
      dispatch({ type: MORE_ORDERS_LOADING });
      await dispatch({
        type: SET_ORDERS_PAGE,
        payload: getState().logistics.ordersCurrentPage + 1,
      })
      const { ordersCurrentPage, currentOnly } = getState().logistics;
      const ordersQuery = `?page=${ordersCurrentPage}`
      const orders = await axios.get(`/api/orders/${ordersQuery}${currentOnly ? `&delivered=false`: ''}`, tokenConfig(getState))
      dispatch({
        type: GET_MORE_ORDERS,
        payload: orders.data,
      })
    }
  } catch (err) {
    dispatch({ type: ORDERS_ERROR });
    dispatch({ type: AUTH_ERROR});
  }
}
export const getOrder = ({ orderID }) => async (dispatch, getState) => {
  dispatch({type: ORDER_LOADING});
  try {
    const res = await axios.get(`/api/order/${orderID}/`, tokenConfig(getState))
    dispatch({
      type: GET_ORDER,
      payload: res.data
    });
  } catch (err) {
    dispatch({type: AUTH_ERROR});
    dispatch({type: ORDER_ERROR});
  }
}
export const setCurrentOnly = ({ bool }) => async (dispatch, getState) => {
  dispatch({
    type: FILTER_CURRENT_ONLY,
    payload: bool
  })
}


// ORDER ITEMS
export const addOrderItem = ({ productId }) => async (dispatch, getState) => {
  const body = {
    order: getState().logistics.currentOrder.id,
    product_variant: productId
  }
  try {
    const res = await axios.post(`/api/order_item/`, body, tokenConfig(getState))
    await dispatch(getCurrentOrder({
      type: 'food',
      updateOnly: true
    }));
    M.toast({
      html: res.data.msg,
      displayLength: 3500,
      classes: res.data.class,
    });
  } catch (err) {
    dispatch({ type: AUTH_ERROR});
  }
}
export const deleteOrderItem = ({ id }) => async (dispatch, getState) => {
  dispatch({ type: DELETE_LOADING });
  try {
    await axios.delete(`/api/order_item/${id}/`, tokenConfig(getState))
    await dispatch(getCurrentOrder({ updateOnly: true }));
    dispatch({
      type: DELETE_ORDER_ITEM,
      payload: id
    })
  } catch (err) {
    dispatch({ type: DELETE_ERROR });
    dispatch({ type: AUTH_ERROR});
  }
}
export const changeQuantity = ({ orderItemID, operation }) => async (dispatch, getState) => {
  dispatch({ type: QUANTITY_LOADING })  
  try {
    const res = await axios.put(`/api/change_quantity/${orderItemID}/${operation}/`, null, tokenConfig(getState))
    if (res.data.status === 'okay') {
      dispatch({ type: QUANTITY_CHANGED })
      dispatch(getCurrentOrder({updateOnly:true}))
    } else {
      dispatch({ type: QUANTITY_CHANGE_ERROR })
      M.toast({
        html: res.data.msg,
        displayLength: 3500,
        classes: 'red',
      });
    }
  } catch (err) {
    dispatch({ type: AUTH_ERROR })
    dispatch({ type: QUANTITY_CHANGE_ERROR })
  }
}

// SHOP
export const checkout = ({ formData, history }) => async (dispatch, getState) => {
  dispatch({ type: CHECKOUT_LOADING })
  try {
    const orderBody = {
      user: getState().auth.user.id,
  
      first_name: formData.firstName,
      last_name: formData.lastName,
      contact: formData.contact,
      email: formData.email,
      gender: formData.gender,
  
      loc1_latitude: parseFloat(formData.pickupLat),
      loc1_longitude: parseFloat(formData.pickupLng),
      loc1_address: formData.pickupAddress,
      loc2_latitude: parseFloat(formData.deliveryLat),
      loc2_longitude: parseFloat(formData.deliveryLng),
      loc2_address: formData.deliveryAddress,
      distance_text: formData.distanceText,
      distance_value: formData.distanceValue,
      duration_text: formData.durationText,
      duration_value: formData.durationValue,
    }
    const res = await axios.put('/api/checkout/', orderBody, tokenConfig(getState))
    if (res.data.status === "okay") {
      dispatch({ type: CHECKOUT_SUCCESS })
      history.push(`/payments`)
    } else {
      dispatch({ type: CHECKOUT_FAILED })
      M.toast({
        html: res.data.msg,
        displayLength: 3500,
        classes: 'red',
      });
      dispatch(getCurrentOrder({}))
    }
  } catch (err) {
    console.log(err)
  }
}
export const finalizeTransaction = ({ authID, history }) => async (dispatch, getState) => {
  dispatch({ type: COMPLETE_ORDER_LOADING });

  let paypalkeys

  try {
    const res = await axios.get('/api/auth/paypal_keys', tokenConfig(getState))
    paypalkeys = res.data
  } catch (err) {
    dispatch({type: AUTH_ERROR});
    M.toast({
      html: 'Session timed out. Please login again.',
      displayLength: 5000,
      classes: 'red'
    });
  }

  const paypalClient = paypalkeys['PAYPAL_CLIENT_ID']
  const paypalSecret = paypalkeys['PAYPAL_CLIENT_SECRET']
  const paypalOauth = 'https://api.sandbox.paypal.com/v1/oauth2/token/'
  const paypalAuth = 'https://api.sandbox.paypal.com/v2/payments/authorizations/'

  // Get access token
  const basicAuth = btoa(`${ paypalClient }:${ paypalSecret }`)
  const config = {
    headers: {
      Accept: `application/json`,
      Authorization: `Basic ${ basicAuth }`
    },
  }
  const auth = await axios.post(paypalOauth, `grant_type=client_credentials`, config)

  // Capture or Void Transaction
  const authConfig = {
    headers: {
      Accept: `application/json`,
      Authorization: `Bearer ${ auth.data.access_token }`
    }
  }
  
  const res = await axios.get(`/api/current_order/?for_checkout=true`, tokenConfig(getState))
  try {
    if (res.data.has_valid_item === true) {
      const capture = await axios.post(paypalAuth+authID+'/capture/', {}, authConfig)
      const body = {
        'auth_id': authID,
        'capture_id': capture.data.id,
      }
      await axios.put(`/api/complete_order/2/`, body, tokenConfig(getState))
      dispatch({ type: COMPLETE_ORDER_SUCCESS });
      M.toast({
        html: 'Order Successful!',
        displayLength: 5000,
        classes: 'green'
      });
      history.push('/cart')
    } else {
      await axios.post(paypalAuth+authID+'/void', {}, authConfig)
      dispatch({ type: COMPLETE_ORDER_FAILED });
      M.toast({
        html: 'Payment error. Stocks may have changed. Please Try again.',
        displayLength: 5000,
        classes: 'red'
      });
      history.push('/cart')
    }
  } catch (err) {
    dispatch({ type: COMPLETE_ORDER_FAILED });
    dispatch({ type: AUTH_ERROR});
    M.toast({
      html: 'Session timed out. Please login again.',
      displayLength: 5000,
      classes: 'red'
    });
  }
}
export const payWithCOD = ({ history }) => async (dispatch, getState) => {
  dispatch({ type: COMPLETE_ORDER_LOADING });
  
  const res = await axios.get(`/api/current_order/?for_checkout=true`, tokenConfig(getState))

  try {
    if (res.data.has_valid_item === true) {
      await axios.put(`/api/complete_order/1/`, null, tokenConfig(getState))
      dispatch({ type: COMPLETE_ORDER_SUCCESS });
      M.toast({
        html: 'Order Successful!',
        displayLength: 5000,
        classes: 'green'
      });
      history.push('/cart')
    } else {
      dispatch({ type: COMPLETE_ORDER_FAILED });
      M.toast({
        html: 'Payment error. Stocks may have changed. Please Try again.',
        displayLength: 5000,
        classes: 'red'
      });
      history.push('/cart')
    }
  } catch (err) {
    dispatch({ type: COMPLETE_ORDER_FAILED });
    dispatch({ type: AUTH_ERROR});
    M.toast({
      html: 'Session timed out. Please login again.',
      displayLength: 5000,
      classes: 'red'
    });
  }
}


// REVIEW
export const getOrderItem = ({ orderItemID }) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_ITEM_LOADING });
    const res = await axios.get(`/api/order_item/${orderItemID}`, tokenConfig(getState))
    dispatch({
      type: GET_ORDER_ITEM,
      payload: res.data,
    })
  } catch (err) {
    dispatch({ type: ORDER_ITEM_ERROR });
    dispatch({ type: AUTH_ERROR});
  }
}
export const reviewProduct = ({ order_item, product_variant, userID, rating, comment, history }) => async (dispatch, getState) => {
  $('.loader').fadeIn();
  const body = {
    order_item,
    product_variant,
    user: userID,
    rating,
    comment
  }
  try {
    const res = await axios.post('/api/review_product/', body, tokenConfig(getState));
    if (res.data.status === "okay") {
      M.toast({
        html: 'Product Reviewed',
        displayLength: 5000,
        classes: 'green'
      });
      // history.push('/bookings')
      // console.log(res.data)
      dispatch({
        type: REVIEW_PRODUCT,
        payload: res.data
      })
    } else if (res.data.status === "error") {
      M.toast({
        html: 'You already reviewed that',
        displayLength: 5000,
        classes: 'red'
      });
      history.push('/bookings')
    }
  } catch (err) {
    console.error(err)
    M.toast({
      html: 'You already reviewed that',
      displayLength: 5000,
      classes: 'red'
    });
    history.push('/bookings')
  }
  $('.loader').fadeOut();
}
export const reviewProductOrder = ({ order, userID, rating, comment, history }) => async (dispatch, getState) => {
  $('.loader').fadeIn();
  const body = {
    order,
    user: userID,
    rating,
    comment
  }
  try {
    const res = await axios.post('/api/review_order/', body, tokenConfig(getState));
    if (res.data.status === "okay") {
      M.toast({
        html: 'Order Reviewed',
        displayLength: 5000,
        classes: 'green'
      });
      dispatch({
        type: REVIEW_PRODUCT_ORDER,
        payload: res.data
      })
    } else if (res.data.status === "error") {
      M.toast({
        html: 'You already reviewed that',
        displayLength: 5000,
        classes: 'red'
      });
      history.push('/bookings')
    }
  } catch (err) {
    console.error(err)
    M.toast({
      html: 'You already reviewed that',
      displayLength: 5000,
      classes: 'red'
    });
    history.push('/bookings')
  }
  $('.loader').fadeOut();
}
export const reviewOrder = ({ order, userID, rating, comment, history }) => async (dispatch, getState) => {
  $('.loader').fadeIn();
  const body = {
    order,
    user: userID,
    rating,
    comment
  }
  try {
    const res = await axios.post('/api/review_order/', body, tokenConfig(getState));
    if (res.data.status === "okay") {
      M.toast({
        html: 'Order Reviewed',
        displayLength: 5000,
        classes: 'green'
      });
      dispatch({
        type: REVIEW_ORDER,
        payload: res.data
      })
    } else if (res.data.status === "error") {
      M.toast({
        html: 'You already reviewed that',
        displayLength: 5000,
        classes: 'red'
      });
      history.push('/bookings')
    }
  } catch (err) {
    console.error(err)
    M.toast({
      html: 'You already reviewed that',
      displayLength: 5000,
      classes: 'red'
    });
    history.push('/bookings')
  }
  $('.loader').fadeOut();
}



export const toggleFavorite = id => async (dispatch, getState) => {
  const user = getState().auth.user

  try {
    if (user.favoritesPID.includes(id)) {
      user.favoritesPID.splice(user.favoritesPID.indexOf(id), 1)
      await axios.delete(`/api/favorite/${id}`, tokenConfig(getState))
      dispatch({
        type: USER_UPDATED,
        payload: user
      })
    } else {
      user.favoritesPID.unshift(id)
      const body = {
        user: user.id,
        product: id,
      }
      await axios.post(`/api/favorites/`, body, tokenConfig(getState))
      dispatch({
        type: USER_UPDATED,
        payload: user
      })
    }
  } catch (err) {
    if (err.response.data[Object.keys(err.response.data)] === 'Invalid token.') {
      dispatch({type: AUTH_ERROR});
      dispatch(setAlert({ type:'danger', msg:'Session timed out. Please login again.' }));
    } else {
      dispatch(setAlert({type:'danger', msg:err.response.data[Object.keys(err.response.data)]}));
    }
  }
}

export const getFavorites = () => async (dispatch, getState) => {
  dispatch({ type: FAVORITES_LOADING });

  try {
    const res = await axios.get(`/api/favorites/`, tokenConfig(getState))
    dispatch({
      type: GET_FAVORITES,
      payload: res.data
    })
  } catch (err) {
    if (err.response.data[Object.keys(err.response.data)] === 'Invalid token.') {
      dispatch({type: AUTH_ERROR});
      dispatch(setAlert({ type:'danger', msg:'Session timed out. Please login again.' }));
    } else {
      dispatch(setAlert({type:'danger', msg:err.response.data[Object.keys(err.response.data)]}));
    }
  }
}

export const deleteFavorite = id => async (dispatch, getState) => {
  if (!getState().shopping.favoritesLoading) {
    dispatch({ type: FAVORITES_LOADING });
    try {
      await axios.delete(`/api/favorite/${id}/`, tokenConfig(getState))
      dispatch({
        type: DELETE_FAVORITE,
        payload: id
      })
      dispatch(setAlert({ type:'success', msg: 'Item removed from favorites'}))
    } catch (err) {
      if (err.response.data[Object.keys(err.response.data)] === 'Invalid token.') {
        dispatch({type: AUTH_ERROR});
        dispatch(setAlert({ type:'danger', msg:'Session timed out. Please login again.' }));
      } else {
        dispatch(setAlert({type:'danger', msg:err.response.data[Object.keys(err.response.data)]}));
      }
    }
  }
}

export const createReview = (product, userID, rating, comment, history) => async (dispatch, getState) => {
  const body = {
    product,
    user: userID,
    rating,
    comment
  }
  try {
    const res = await axios.post('/api/create_review/', body, tokenConfig(getState));
    if (res.data.status === "okay") {
      dispatch(setAlert({type:'success', msg:"Product reviewed" }));
      history.push('/orders')
    } else if (res.data.status === "error") {
      dispatch(setAlert({type:'danger', msg: res.data.message }));
      history.push('/orders')
    }
  } catch (err) {
    if (err.response.data[Object.keys(err.response.data)] === 'Invalid token.') {
      dispatch({type: AUTH_ERROR});
      dispatch(setAlert({ type:'danger', msg:'Session timed out. Please login again.' }));
    } else {
      dispatch(setAlert({type:'danger', msg:err.response.data[Object.keys(err.response.data)]}));
    }
  }
}

export const requestRefund = (orderItemID, reason, history) => async (dispatch, getState) => {
  const body = {
    order_item: orderItemID,
    comment: reason
  }
  try {
    const res = await axios.post('/api/request_refund/', body, tokenConfig(getState));
    if (res.data.status === "okay") {
      dispatch(setAlert({type:'success', msg:"Refund requested" }));
      history.push('/orders')
    } else if (res.data.status === "error") {
      dispatch(setAlert({type:'danger', msg: res.data.message }));
      history.push('/orders')
    }
  } catch (err) {
    if (err.response.data[Object.keys(err.response.data)] === 'Invalid token.') {
      dispatch({type: AUTH_ERROR});
      dispatch(setAlert({ type:'danger', msg:'Session timed out. Please login again.' }));
    } else {
      dispatch(setAlert({type:'danger', msg:err.response.data.message}));
    }
  }
}