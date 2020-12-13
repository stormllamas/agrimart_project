import moment from 'moment'
import axios from 'axios';

import {
  DASHBOARD_LOADING,
  GET_DASHBOARD_DATA,
  DASHBOARD_DATA_ERROR,

  GET_MANAGER_ORDER_ITEMS,
  MANAGER_ORDER_ITEMS_ERROR,

  GET_MANAGER_ORDERS,
  MANAGER_ORDERS_ERROR,

  MANAGER_ORDER_LOADING,
  GET_MANAGER_ORDER,
  MANAGER_ORDER_ERROR,

  PROCESS_ORDER,

  DELIVER_ORDER_ITEM,
  DELIVER_ORDER,

  PREPARE_ORDER_ITEM,
  PREPARE_ORDER,

  AUTH_ERROR
} from './types'


import { tokenConfig } from './auth';
import { getCurrentOrder } from './logistics';

export const renderRevenueGraph = data => (dispatch, getState) => {
  var chart = new CanvasJS.Chart("revenue_chart_container", {
    animationEnabled: true,
    theme: "light2",
    title:{
      text: ""
    },
    axisX:{
      valueFormatString: "DD MMM",
      crosshair: {
        enabled: true,
        snapToDataPoint: true
      }
    },
    axisY: {
      title: "Amount in Peso",
      includeZero: true,
      crosshair: {
        enabled: true
      }
    },
    toolTip:{
      shared:true
    },  
    legend:{
      cursor:"pointer",
      verticalAlign: "bottom",
      horizontalAlign: "left",
      dockInsidePlotArea: true,
      itemclick: toogleDataSeries
    },
    data: [
      {
        type: "line",
        showInLegend: true,
        name: "Sale",
        markerType: "square",
        xValueFormatString: "DD MMM, YYYY",
        color: "#F08080",
        dataPoints: data.orders
      }
    ]
  });
  chart.render();
  
  function toogleDataSeries(e){
    if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
      e.dataSeries.visible = false;
    } else{
      e.dataSeries.visible = true;
    }
    chart.render();
  }
}

export const renderSalesPieChart = data => (dispatch, getState) => {
  var chart = new CanvasJS.Chart("sales_chart_container", {
    animationEnabled: true,
    title:{
      text: "",
      horizontalAlign: "left",
    },
    legend:{
      cursor: "pointer",
      fontFamily: "Bahnschrift"
      // itemclick: explodePie
    },
    data: [{
      type: "doughnut",
      showInLegend: true,
      startAngle: 60,
      innerRadius: 80,
      indexLabelFontSize: 17,
      indexLabel: "{label} - #percent%",
      indexLabel: "",
      toolTipContent: "<b>{label}:</b> {y} (#percent%)",
      dataPoints: [
        { y: data.orders_count, label: "Food", color: '#FFC442', legendText: "Food" },
      ]
    }]
  });
  chart.render();
}

export const getDashboardData = ({ fromDate, toDate }) => async (dispatch, getState) => {
  // dispatch({ type: DASHBOARD_LOADING })
  try {
    const res = await axios.get(`/api/manager/dashboard_data?from_date=${fromDate}&to_date=${toDate}`, tokenConfig(getState))
    dispatch({
      type: GET_DASHBOARD_DATA,
      payload: res.data
    });
  } catch (err) {
    dispatch({type: DASHBOARD_DATA_ERROR});
  }
}

export const getSellerDashboardData = ({ fromDate, toDate }) => async (dispatch, getState) => {
  // dispatch({ type: DASHBOARD_LOADING })
  try {
    const res = await axios.get(`/api/manager/seller_dashboard_data?from_date=${fromDate}&to_date=${toDate}`, tokenConfig(getState))
    dispatch({
      type: GET_DASHBOARD_DATA,
      payload: res.data
    });
  } catch (err) {
    dispatch({type: DASHBOARD_DATA_ERROR});
  }
}

export const getOrders = ({ page, processed, prepared, delivered, keywords, range }) => async (dispatch, getState) => {
  $('.loader').fadeIn();
  try {
    let res;
    if (range) {
      res = await axios.get(`/api/manager/orders?range=${range}`, tokenConfig(getState))
    } else {
      res = await axios.get(`/api/manager/orders?page=${page ? page : '0'}${processed !== undefined ? `&processed=${processed}` : ''}${prepared !== undefined ? `&prepared=${prepared}` : ''}${delivered !== undefined ? `&delivered=${delivered}` : ''}${keywords !== undefined ? `&keywords=${keywords}` : ''}`, tokenConfig(getState))
    }
    dispatch({
      type: GET_MANAGER_ORDERS,
      payload: res.data
    });
    $('.loader').fadeOut();
  } catch (err) {
    console.log(err)
    dispatch({type: MANAGER_ORDERS_ERROR});
    dispatch({type: AUTH_ERROR});
    $('.loader').fadeOut();
  }
}

export const getOrder = ({ id }) => async (dispatch, getState) => {
  dispatch({type: MANAGER_ORDER_LOADING});
  try {
    const res = await axios.get(`/api/manager/order/${id}/`, tokenConfig(getState))
    dispatch({
      type: GET_MANAGER_ORDER,
      payload: res.data
    });
  } catch (err) {
    dispatch({type: AUTH_ERROR});
    dispatch({type: MANAGER_ORDER_ERROR});
  }
}

export const processOrder = ({ id }) => async (dispatch, getState) => {
  $('.loader').fadeIn();
  try {
    const res = await axios.put(`/api/manager/process_order/${id}/`, null, tokenConfig(getState))
    if (res.data.status) {
      if (res.data.status === 'error' && res.data.msg === 'Order already processed') {
        await dispatch(getOrders({
          page: 1,
          processed: false,
          prepared: false,
          delivered: false,
          keywords: ''
        }))
        M.toast({
          html: res.data.msg,
          displayLength: 5000,
          classes: 'red'
        });
      }
    } else {
      dispatch({
        type: PROCESS_ORDER,
        payload: res.data
      });
      M.toast({
        html: 'Orders Processed',
        displayLength: 5000,
        classes: 'orange'
      });
    }
    $('.loader').fadeOut();
  } catch (err) {
    await dispatch(getOrders({
      page: 1,
      processed: false,
      prepared: false,
      delivered: false,
      keywords: ''
    }))
    $('.loader').fadeOut();
  }
}

export const prepareOrderItem = ({ id }) => async (dispatch, getState) => {
  $('.loader').fadeIn();

  try {
    const res = await axios.put(`/api/manager/prepare_order_item/${id}/`, null, tokenConfig(getState))
    await dispatch(getOrder({
      id: getState().manager.order.id
    }))
    if (res.data.status === 'error') {
      M.toast( {
        html: res.data.msg,
        displayLength: 5000,
        classes: 'red'
      });
    } else {
      await dispatch({
        type: PREPARE_ORDER_ITEM,
        payload: res.data
      });
      M.toast({
        html: 'Item marked as prepared',
        displayLength: 5000,
        classes: 'orange'
      });
      if (res.data.order_prepared) {
        await dispatch({
          type: PREPARE_ORDER,
          payload: getState().manager.order
        });
        M.toast({
          html: 'Order prepared',
          displayLength: 5000,
          classes: 'blue'
        });
      }
    }
    $('.loader').fadeOut();
  } catch (error) {
    $('.loader').fadeOut();
  }
}
export const prepareOrder = ({ id }) => async (dispatch, getState) => {
  $('.loader').fadeIn();

  try {
    const res = await axios.put(`/api/manager/prepare_order/${id}/`, null, tokenConfig(getState))
    if (res.data.status) {
      if (res.data.status === 'error' && res.data.msg === 'Order already picked up') {
        await dispatch(getOrders({
          page: 1,
          claimed: true,
          delivered: false,
          keywords: ''
        }))
        M.toast({
          html: res.data.msg,
          displayLength: 5000,
          classes: 'red'
        });
      }
    } else {
      dispatch({
        type: PREPARE_ORDER,
        payload: res.data
      });
      M.toast({
        html: 'Order fulfilled',
        displayLength: 5000,
        classes: 'blue'
      });
    }
    $('.loader').fadeOut();
  } catch (error) {
    $('.loader').fadeOut();
  }
}

export const deliverOrderItem = ({ id }) => async (dispatch, getState) => {
  $('.loader').fadeIn();

  try {
    const res = await axios.put(`/api/manager/deliver_order_item/${id}/`, null, tokenConfig(getState))
    await dispatch(getOrder({
      id: getState().manager.order.id
    }))
    if (res.data.status === 'error') {
      M.toast( {
        html: res.data.msg,
        displayLength: 5000,
        classes: 'red'
      });
    } else {
      await dispatch({
        type: DELIVER_ORDER_ITEM,
        payload: res.data
      });
      M.toast({
        html: 'Item marked as delivered',
        displayLength: 5000,
        classes: 'orange'
      });
      if (res.data.order_delivered) {
        await dispatch({
          type: DELIVER_ORDER,
          payload: getState().manager.order
        });
        M.toast({
          html: 'Order delivered',
          displayLength: 5000,
          classes: 'blue'
        });
      }
    }
    $('.loader').fadeOut();
  } catch (error) {
    $('.loader').fadeOut();
  }
}
export const deliverOrder = ({ id }) => async (dispatch, getState) => {
  $('.loader').fadeIn();

  try {
    const res = await axios.put(`/api/manager/deliver_order/${id}/`, null, tokenConfig(getState))
    if (res.data.status) {
      if (res.data.status === 'error' && res.data.msg === 'Order already delivered') {
        await dispatch(getOrders({
          page: 1,
          claimed: true,
          delivered: false,
          keywords: ''
        }))
        M.toast({
          html: res.data.msg,
          displayLength: 5000,
          classes: 'red'
        });
      }
    } else {
      dispatch({
        type: DELIVER_ORDER,
        payload: res.data
      });
      M.toast({
        html: 'Order fulfilled',
        displayLength: 5000,
        classes: 'blue'
      });
    }
    $('.loader').fadeOut();
  } catch (error) {
    $('.loader').fadeOut();
  }
}

export const getOrderItems = ({ page, delivered, keywords, range }) => async (dispatch, getState) => {
  $('.loader').fadeIn();
  try {
    let res;
    if (range) {
      res = await axios.get(`/api/manager/order_items?range=${range}`, tokenConfig(getState))
    } else {
      res = await axios.get(`/api/manager/order_items?page=${page ? page : '0'}&delivered=${delivered ? delivered : 'false'}&keywords=${keywords}`, tokenConfig(getState))
    }
    dispatch({
      type: GET_MANAGER_ORDER_ITEMS,
      payload: res.data
    });
    $('.loader').fadeOut();
  } catch (err) {
    dispatch({type: MANAGER_ORDER_ITEMS_ERROR});
    dispatch({type: AUTH_ERROR});
    $('.loader').fadeOut();
  }
}

export const getRefunds = ({ page, delivered, keywords, range }) => async (dispatch, getState) => {
  $('.loader').fadeIn();
  try {
    let res;
    if (range) {
      res = await axios.get(`/api/manager/order_items?range=${range}`, tokenConfig(getState))
    } else {
      res = await axios.get(`/api/manager/order_items?page=${page ? page : '0'}&delivered=${delivered ? delivered : 'false'}&keywords=${keywords}`, tokenConfig(getState))
    }
    dispatch({
      type: GET_MANAGER_ORDER_ITEMS,
      payload: res.data
    });
    $('.loader').fadeOut();
  } catch (err) {
    dispatch({type: MANAGER_ORDER_ITEMS_ERROR});
    $('.loader').fadeOut();
  }
}