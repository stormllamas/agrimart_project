import React, { Fragment, useEffect, useState } from 'react'
import { HashLink as Link } from 'react-router-hash-link';
import { Redirect, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import OrderItem from './OrderItem'
import Preloader from '../../common/Preloader'

import { getOrders, setCurrentOnly } from '../../../actions/logistics'


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
  setCurrentOnly
}) => {
  const history = useHistory()

  const [order, setOrder] = useState('');
  const [showCurrentOnly, setShowCurrentOnly] = useState(false);
  
  useEffect(() => {
    setCurrentOnly({
      bool: showCurrentOnly
    })
  }, [showCurrentOnly]);
  
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
            <div id="ordermodal" className="modal modal-fixed-footer supermodal">
              {order === '' ? (
                <div className="full-height flex-col middle center relative preloader-wrapper pb-5">
                  <Preloader color="green" size="big" adds="visible"/>
                </div>
              ) : (
                <Fragment>
                  <div className="modal-content">
                    <h5 className="mt-0 mb-2">ORDER TRACKER <small>({order.ref_code})</small></h5>
                    <div className="row center">
                      {order.is_claimed ? (
                        <Fragment>
                          <div className="col s12">
                            <i className="material-icons green-text text-lighten-2">more_vert</i>
                          </div>
                          <div className="col s12 mb-1 flex-col center">
                            <h6 className="valign-wrapper green-text text-lighten-2"><i className="material-icons mr-1">search</i> RIDER FOUND</h6>
                          </div>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <div className="col s12">
                            <i className="material-icons blue-text">more_vert</i>
                          </div>
                          <div className="col s12 mb-1 flex-col center">
                            <h6 className="valign-wrapper blue-text"><i className="material-icons mr-1">search</i> Searching for a rider</h6>
                          </div>
                        </Fragment>
                      )}
                      {order.order_type === 'food' ? (
                        order.is_claimed && order.is_pickedup ? (
                          <Fragment>
                            <div className="col s12">
                              <i className="material-icons green-text text-lighten-2">more_vert</i>
                            </div>
                            <div className="col s12 mb-1 flex-col center">
                              <h6 className="valign-wrapper green-text text-lighten-2"><i className="material-icons mr-1">room_service</i>ORDER HAS BEEN PICKED UP</h6>
                            </div>
                          </Fragment>
                        ) : (
                          order.is_claimed ? (
                            <Fragment>
                              <div className="col s12">
                                <i className="material-icons blue-text">more_vert</i>
                              </div>
                              <div className="col s12 mb-1 flex-col center">
                                <h6 className="valign-wrapper blue-text"><i className="material-icons mr-1">room_service</i>Your food is being prepared</h6>
                              </div>
                            </Fragment>
                          ) : (
                            <Fragment>
                              <div className="col s12">
                                <i className="material-icons">more_vert</i>
                              </div>
                              <div className="col s12 mb-1 flex-col center">
                                <h6 className="valign-wrapper"><i className="material-icons mr-1">room_service</i>Your food is being prepared</h6>
                              </div>
                            </Fragment>
                          )
                        )
                      ) : (
                        order.is_claimed && order.is_pickedup ? (
                          <Fragment>
                            <div className="col s12">
                              <i className="material-icons green-text text-lighten-2">more_vert</i>
                            </div>
                            <div className="col s12 mb-1 flex-col center">
                              <h6 className="valign-wrapper green-text text-lighten-2"><i className="material-icons mr-1">two_wheeler</i>PICKED UP PARCEL</h6>
                            </div>
                          </Fragment>
                        ) : (
                          order.is_claimed ? (
                            <Fragment>
                              <div className="col s12">
                                <i className="material-icons blue-text">more_vert</i>
                              </div>
                              <div className="col s12 mb-1 flex-col center">
                                <h6 className="valign-wrapper blue-text"><i className="material-icons mr-1">two_wheeler</i> Rider is heading to pickup location</h6>
                              </div>
                            </Fragment>
                          ) : (
                            <Fragment>
                              <div className="col s12">
                                <i className="material-icons">more_vert</i>
                              </div>
                              <div className="col s12 mb-1 flex-col center">
                                <h6 className="valign-wrapper"><i className="material-icons mr-1">two_wheeler</i> Rider is heading to pickup location</h6>
                              </div>
                            </Fragment>
                          )
                        )
                      )}
                      {order.is_pickedup ? (
                        <Fragment>
                          <div className="col s12">
                            <i className="material-icons blue-text">more_vert</i>
                          </div>
                          <div className="col s12 mb-1 flex-col center">
                            <h6 className="valign-wrapper blue-text"><i className="material-icons mr-1">local_shipping</i>Your order is being delivered</h6>
                          </div>
                        </Fragment>
                      ) : (
                        <Fragment>
                          <div className="col s12">
                            <i className="material-icons">more_vert</i>
                          </div>
                          <div className="col s12 mb-1 flex-col center">
                            <h6 className="valign-wrapper"><i className="material-icons mr-1">local_shipping</i>Your order is being delivered</h6>
                          </div>
                        </Fragment>
                      )}
                    </div>
                  </div>
                </Fragment>
              )}
              <div className="modal-footer">
                <a className="modal-close cancel-fixed"><i className="material-icons grey-text">close</i></a>
              </div>
            </div>
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
}

const mapStateToProps = state => ({
  auth: state.auth,
  logistics: state.logistics,
});

export default connect(mapStateToProps, { getOrders, setCurrentOnly })(Bookings);