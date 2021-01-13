import React, { Fragment, useEffect, useState } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import OrderItem from './OrderItem'
import Preloader from '../../common/Preloader'

import { getOrders, setCurrentOnly, syncOrder } from '../../../actions/logistics'


const Bookings = ({
  auth: {
    isAuthenticated
  },
  logistics: {
    ordersLoading,
    orders,
    currentOnly
  },
  getOrders,
  setCurrentOnly,
  setCurLocation,
  syncOrder
}) => {
  const history = useHistory()

  const [order, setOrder] = useState('');
  const [showCurrentOnly, setShowCurrentOnly] = useState(false);

  const [socket, setSocket] = useState('')
  
  useEffect(() => {
    setCurrentOnly({
      bool: showCurrentOnly
    })
  }, [showCurrentOnly]);
  
  useEffect(() => {
    setCurLocation(history.location)
  }, [history]);
  
  useEffect(() => {
    getOrders({
      getMore: false,
    })
  }, [currentOnly]);
  
  useEffect(() => {
    if (!ordersLoading) {
      $('.loader').fadeOut();
      $('.middle-content').fadeIn();
      $('.modal').modal({
        dismissible: true,
        inDuration: 300,
        outDuration: 200,
      });
    } else {
      $('.loader').show();
      $('.middle-content').hide();
    }
  }, [ordersLoading]);

  
  useEffect(() => {
    let wsStart = 'ws://'
    let port = ''
    if (window.location.protocol === 'https:') {
      wsStart = 'wss://'
      port = ':8001'
    }
    let endpoint = wsStart + window.location.host + port
    setSocket(new ReconnectingWebSocket(endpoint+'/order_update/'))
  }, []);

  useEffect(() => {
    if (socket) {
      socket.onmessage = function(e){
        console.log('message', e)
        const data = JSON.parse(e.data)
        syncOrder({ data })
      }
      socket.onopen = function(e){
        // console.log('open', e)
      }
      socket.onerror = function(e){
        // console.log('error', e)
      }
      socket.onclose = function(e){
        // console.log('close', e)
      }
    }
  }, [socket]);

  return (
    isAuthenticated ? (
      <Fragment>
        <section className="section section-orders">
          <div className="container">
            <h5 className="mb-4">My Orders</h5>
            <div className="switch mb-3">
              <label className="fs-16">
                Show Current Only
                <input type="checkbox" onChange={e => setShowCurrentOnly(e.target.checked)}/>
                <span className="lever"></span>
              </label>
            </div>
            <ul>
              {!ordersLoading ? (
                orders !== null && (
                  orders.results.map((order, index) => (
                    <OrderItem key={order.id} order={order} orders={orders} index={index} ordersLoading={ordersLoading} setOrder={setOrder} />
                  ))
                )
              ) : (
                <div className="flex-col center relative preloader-wrapper">
                  <Preloader color="green" size="small" adds=""/>
                </div>
              )}
            </ul>
          </div>
        </section>
      </Fragment>
    ) : (
      <Redirect to="/"/>
    )
  )
}

Bookings.propTypes = {
  getOrders: PropTypes.func.isRequired,
  setCurrentOnly: PropTypes.func.isRequired,
  syncOrder: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getOrders, setCurrentOnly, syncOrder })(Bookings);